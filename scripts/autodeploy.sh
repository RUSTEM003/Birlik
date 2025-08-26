#!/bin/bash

set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-agi-portal}"
REGION="${AWS_REGION:-us-west-2}"
DOMAIN="${DOMAIN:-agi-portal.example.com}"
WAF_ARN="${WAF_ARN:-}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

check_prerequisites() {
    log "Checking prerequisites..."
    
    command -v terraform >/dev/null 2>&1 || { echo "terraform is required but not installed"; exit 1; }
    command -v helm >/dev/null 2>&1 || { echo "helm is required but not installed"; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required but not installed"; exit 1; }
    command -v aws >/dev/null 2>&1 || { echo "aws cli is required but not installed"; exit 1; }
    
    aws sts get-caller-identity >/dev/null 2>&1 || { echo "AWS credentials not configured"; exit 1; }
    
    log "Prerequisites check passed"
}

deploy_infrastructure() {
    log "Deploying AWS infrastructure..."
    
    cd terraform/aws
    
    terraform init
    
    terraform plan -var="cluster_name=$CLUSTER_NAME" -var="region=$REGION" -var="domain_name=$DOMAIN"
    
    terraform apply -auto-approve -var="cluster_name=$CLUSTER_NAME" -var="region=$REGION" -var="domain_name=$DOMAIN"
    
    CLUSTER_ENDPOINT=$(terraform output -raw cluster_endpoint)
    CLUSTER_NAME_OUTPUT=$(terraform output -raw cluster_name)
    
    log "Infrastructure deployment completed"
    log "Cluster endpoint: $CLUSTER_ENDPOINT"
    
    cd ../..
}

configure_kubectl() {
    log "Configuring kubectl..."
    
    aws eks update-kubeconfig --region "$REGION" --name "$CLUSTER_NAME"
    
    kubectl cluster-info
    
    log "kubectl configured successfully"
}

install_controllers() {
    log "Installing Kubernetes controllers..."
    
    helm repo add eks https://aws.github.io/eks-charts
    helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
        -n kube-system \
        --set clusterName="$CLUSTER_NAME" \
        --set serviceAccount.create=false \
        --set serviceAccount.name=aws-load-balancer-controller
    
    helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/
    helm upgrade --install external-dns external-dns/external-dns \
        -n kube-system \
        --set serviceAccount.create=false \
        --set serviceAccount.name=external-dns \
        --set domainFilters[0]="$DOMAIN"
    
    helm repo add jetstack https://charts.jetstack.io
    helm upgrade --install cert-manager jetstack/cert-manager \
        -n cert-manager \
        --create-namespace \
        --set installCRDs=true \
        --set serviceAccount.name=cert-manager \
        --set serviceAccount.create=false
    
    helm repo add external-secrets https://charts.external-secrets.io
    helm upgrade --install external-secrets external-secrets/external-secrets \
        -n external-secrets \
        --create-namespace \
        --set serviceAccount.create=false \
        --set serviceAccount.name=external-secrets
    
    log "Controllers installation completed"
}

install_kyverno() {
    log "Installing Kyverno..."
    
    helm repo add kyverno https://kyverno.github.io/kyverno/
    helm upgrade --install kyverno kyverno/kyverno \
        -n kyverno \
        --create-namespace \
        --set replicaCount=3 \
        --set podDisruptionBudget.enabled=true
    
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=kyverno -n kyverno --timeout=300s
    
    kubectl apply -f platform/policies/kyverno/
    
    log "Kyverno installation and policy deployment completed"
}

deploy_waf() {
    log "Deploying WAF..."
    
    if [[ -n "$WAF_ARN" ]]; then
        log "Using existing WAF ARN: $WAF_ARN"
    else
        aws cloudformation deploy \
            --template-body file://waf/baseline.yaml \
            --stack-name "${CLUSTER_NAME}-waf" \
            --parameter-overrides \
                ClusterName="$CLUSTER_NAME" \
                Environment=production \
            --capabilities CAPABILITY_IAM \
            --region "$REGION"
        
        WAF_ARN=$(aws cloudformation describe-stacks \
            --stack-name "${CLUSTER_NAME}-waf" \
            --region "$REGION" \
            --query 'Stacks[0].Outputs[?OutputKey==`WebACLArn`].OutputValue' \
            --output text)
        
        log "WAF deployed with ARN: $WAF_ARN"
    fi
}

deploy_observability() {
    log "Deploying observability stack..."
    
    chmod +x scripts/deploy-observability.sh
    ./scripts/deploy-observability.sh
    
    log "Observability stack deployment completed"
}

deploy_agi_portal() {
    log "Deploying AGI Portal..."
    
    kubectl create namespace agi --dry-run=client -o yaml | kubectl apply -f -
    
    helm upgrade --install agi-portal helm/agi-portal \
        -n agi \
        --set global.domain="$DOMAIN" \
        --set ingress.wafArn="$WAF_ARN" \
        --set image.backend.repository="$ECR_BACKEND_REPO" \
        --set image.frontend.repository="$ECR_FRONTEND_REPO" \
        --wait \
        --timeout=600s
    
    log "AGI Portal deployment completed"
}

validate_security() {
    log "Running security validation..."
    
    log "Testing Kyverno policies..."
    kubectl apply --dry-run=server -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: test-unsigned-image
  namespace: agi
spec:
  containers:
  - name: test
    image: nginx:latest
    securityContext:
      runAsUser: 0
EOF
    
    log "Testing NetworkPolicies..."
    kubectl get networkpolicies -n agi
    
    log "Testing External Secrets..."
    kubectl get externalsecrets -n agi
    
    log "Security validation completed"
}

setup_secrets_rotation() {
    log "Setting up secrets rotation..."
    
    chmod +x scripts/secrets-rotation.sh
    
    kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: secrets-rotation
  namespace: agi
spec:
  schedule: "0 2 * * 0"  # Weekly on Sunday at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: agi-backend
          containers:
          - name: secrets-rotation
            image: amazon/aws-cli:latest
            command:
            - /bin/bash
            - -c
            - |
              apt-get update && apt-get install -y curl jq
              curl -LO "https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
              chmod +x kubectl && mv kubectl /usr/local/bin/
              /scripts/secrets-rotation.sh
            env:
            - name: CLUSTER_NAME
              value: "$CLUSTER_NAME"
            - name: AWS_REGION
              value: "$REGION"
            - name: NAMESPACE
              value: "agi"
            volumeMounts:
            - name: scripts
              mountPath: /scripts
          volumes:
          - name: scripts
            configMap:
              name: secrets-rotation-script
              defaultMode: 0755
          restartPolicy: OnFailure
EOF
    
    kubectl create configmap secrets-rotation-script \
        --from-file=secrets-rotation.sh=scripts/secrets-rotation.sh \
        -n agi \
        --dry-run=client -o yaml | kubectl apply -f -
    
    log "Secrets rotation setup completed"
}

main() {
    log "Starting AGI Portal deployment with P0 security hardening..."
    
    check_prerequisites
    deploy_infrastructure
    configure_kubectl
    install_controllers
    install_kyverno
    deploy_waf
    deploy_observability
    deploy_agi_portal
    setup_secrets_rotation
    validate_security
    
    log "AGI Portal deployment completed successfully!"
    log "Access the portal at: https://$DOMAIN"
    log "Grafana dashboard: kubectl port-forward -n observability svc/kube-prometheus-stack-grafana 3000:80"
}

main "$@"
