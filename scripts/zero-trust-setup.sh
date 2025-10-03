#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-"spire-system"}
CLUSTER_NAME=${CLUSTER_NAME:-"agi-portal"}

install_spire() {
    echo "Installing SPIRE for Zero Trust mTLS..."
    
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    helm repo add spiffe https://spiffe.github.io/helm-charts-hardened/
    helm repo update
    
    helm upgrade --install spire-crds spiffe/spire-crds \
        --namespace "$NAMESPACE" \
        --create-namespace
    
    helm upgrade --install spire spiffe/spire \
        --namespace "$NAMESPACE" \
        --set global.spire.clusterName="$CLUSTER_NAME" \
        --set global.spire.trustDomain="agi-portal.local" \
        --set spire-server.dataStore.sql.databaseType="postgres" \
        --set spire-server.dataStore.sql.host="postgres.agi-portal.svc.cluster.local" \
        --set spire-server.dataStore.sql.port=5432 \
        --set spire-server.dataStore.sql.database="spire" \
        --set spire-server.dataStore.sql.username="spire" \
        --set spire-server.dataStore.sql.password="spire-password"
    
    echo "SPIRE installed successfully"
}

configure_workload_registration() {
    echo "Configuring workload registration..."
    
    cat << EOF | kubectl apply -f -
apiVersion: spiffeid.spiffe.io/v1beta1
kind: SpiffeID
metadata:
  name: agi-portal-backend
  namespace: agi-portal
spec:
  spiffeId: spiffe://agi-portal.local/backend
  parentId: spiffe://agi-portal.local/node
  selector:
    k8s:
      namespace: agi-portal
      pod-label:
        app: agi-portal-backend
---
apiVersion: spiffeid.spiffe.io/v1beta1
kind: SpiffeID
metadata:
  name: agi-portal-frontend
  namespace: agi-portal
spec:
  spiffeId: spiffe://agi-portal.local/frontend
  parentId: spiffe://agi-portal.local/node
  selector:
    k8s:
      namespace: agi-portal
      pod-label:
        app: agi-portal-frontend
---
apiVersion: spiffeid.spiffe.io/v1beta1
kind: SpiffeID
metadata:
  name: agi-portal-database
  namespace: agi-portal
spec:
  spiffeId: spiffe://agi-portal.local/database
  parentId: spiffe://agi-portal.local/node
  selector:
    k8s:
      namespace: agi-portal
      pod-label:
        app: postgres
EOF
    
    echo "Workload registration configured"
}

install_gvisor() {
    echo "Installing gVisor for container isolation..."
    
    kubectl apply -f https://storage.googleapis.com/gvisor/releases/release/latest/x86_64/gvisor-containerd-shim.yaml
    kubectl apply -f https://storage.googleapis.com/gvisor/releases/release/latest/x86_64/gvisor-containerd-shim-runsc.yaml
    
    cat << EOF | kubectl apply -f -
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
overhead:
  podFixed:
    memory: "20Mi"
    cpu: "10m"
scheduling:
  nodeClassification:
    tolerations:
    - effect: NoSchedule
      key: sandbox.gke.io/runtime
      operator: Equal
      value: gvisor
EOF
    
    echo "gVisor runtime class created"
}

configure_high_risk_workloads() {
    echo "Configuring high-risk workloads for gVisor isolation..."
    
    cat << EOF | kubectl apply -f -
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-gvisor-for-high-risk
  annotations:
    policies.kyverno.io/title: Require gVisor for High-Risk Workloads
    policies.kyverno.io/category: Security
    policies.kyverno.io/severity: high
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: require-gvisor-runtime
      match:
        any:
        - resources:
            kinds:
            - Pod
      validate:
        message: "High-risk workloads must use gVisor runtime class"
        pattern:
          metadata:
            labels:
              security.agi-portal.com/risk-level: "high"
          spec:
            runtimeClassName: "gvisor"
EOF
    
    echo "High-risk workload policy configured"
}

setup_mtls_policies() {
    echo "Setting up mTLS policies..."
    
    cat << EOF | kubectl apply -f -
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: agi-portal
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: agi-portal-authz
  namespace: agi-portal
spec:
  selector:
    matchLabels:
      app: agi-portal-backend
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/agi-portal/sa/agi-portal-frontend"]
  - to:
    - operation:
        methods: ["GET", "POST"]
EOF
    
    echo "mTLS policies configured"
}

main() {
    echo "Setting up Zero Trust architecture..."
    
    install_spire
    configure_workload_registration
    install_gvisor
    configure_high_risk_workloads
    setup_mtls_policies
    
    echo "Zero Trust setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Label high-risk pods with security.agi-portal.com/risk-level=high"
    echo "2. Configure service mesh for automatic mTLS"
    echo "3. Monitor SPIRE logs for workload attestation"
}

main "$@"
</script>
