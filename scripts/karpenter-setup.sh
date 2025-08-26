#!/bin/bash

set -euo pipefail

CLUSTER_NAME=${CLUSTER_NAME:-"agi-portal"}
AWS_REGION=${AWS_REGION:-"us-west-2"}
KARPENTER_VERSION=${KARPENTER_VERSION:-"v0.32.0"}

install_karpenter() {
    echo "Installing Karpenter ${KARPENTER_VERSION}..."
    
    helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter \
        --version "${KARPENTER_VERSION}" \
        --namespace karpenter \
        --create-namespace \
        --set "settings.aws.clusterName=${CLUSTER_NAME}" \
        --set "settings.aws.defaultInstanceProfile=KarpenterNodeInstanceProfile-${CLUSTER_NAME}" \
        --set "settings.aws.interruptionQueueName=${CLUSTER_NAME}" \
        --wait
    
    echo "Karpenter installed successfully"
}

create_node_pools() {
    echo "Creating Karpenter NodePools..."
    
    cat << EOF | kubectl apply -f -
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: critical-workloads
spec:
  template:
    metadata:
      labels:
        node-type: critical
    spec:
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
        - key: kubernetes.io/os
          operator: In
          values: ["linux"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["on-demand"]
        - key: node.kubernetes.io/instance-type
          operator: In
          values: ["m5.large", "m5.xlarge", "m5.2xlarge"]
      nodeClassRef:
        apiVersion: karpenter.k8s.aws/v1beta1
        kind: EC2NodeClass
        name: bottlerocket-critical
      taints:
        - key: CriticalAddonsOnly
          value: "true"
          effect: NoSchedule
  limits:
    cpu: 1000
  disruption:
    consolidationPolicy: WhenEmpty
    consolidateAfter: 30s
---
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: background-workloads
spec:
  template:
    metadata:
      labels:
        node-type: background
    spec:
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
        - key: kubernetes.io/os
          operator: In
          values: ["linux"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: node.kubernetes.io/instance-type
          operator: In
          values: ["m5.large", "m5.xlarge", "c5.large", "c5.xlarge"]
      nodeClassRef:
        apiVersion: karpenter.k8s.aws/v1beta1
        kind: EC2NodeClass
        name: bottlerocket-background
  limits:
    cpu: 2000
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 15s
EOF
    
    echo "NodePools created successfully"
}

create_node_classes() {
    echo "Creating EC2NodeClasses..."
    
    cat << EOF | kubectl apply -f -
apiVersion: karpenter.k8s.aws/v1beta1
kind: EC2NodeClass
metadata:
  name: bottlerocket-critical
spec:
  amiFamily: Bottlerocket
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}"
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}"
  instanceStorePolicy: RAID0
  userData: |
    [settings.kubernetes]
    cluster-name = "${CLUSTER_NAME}"
    api-server = "$(aws eks describe-cluster --name ${CLUSTER_NAME} --query cluster.endpoint --output text)"
    cluster-certificate = "$(aws eks describe-cluster --name ${CLUSTER_NAME} --query cluster.certificateAuthority.data --output text)"
    
    [settings.kubernetes.node-labels]
    "node-type" = "critical"
    
    [settings.kubernetes.node-taints]
    "CriticalAddonsOnly" = "true:NoSchedule"
---
apiVersion: karpenter.k8s.aws/v1beta1
kind: EC2NodeClass
metadata:
  name: bottlerocket-background
spec:
  amiFamily: Bottlerocket
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}"
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "${CLUSTER_NAME}"
  instanceStorePolicy: RAID0
  userData: |
    [settings.kubernetes]
    cluster-name = "${CLUSTER_NAME}"
    api-server = "$(aws eks describe-cluster --name ${CLUSTER_NAME} --query cluster.endpoint --output text)"
    cluster-certificate = "$(aws eks describe-cluster --name ${CLUSTER_NAME} --query cluster.certificateAuthority.data --output text)"
    
    [settings.kubernetes.node-labels]
    "node-type" = "background"
EOF
    
    echo "EC2NodeClasses created successfully"
}

main() {
    echo "Setting up Karpenter for cluster: ${CLUSTER_NAME}"
    
    install_karpenter
    create_node_pools
    create_node_classes
    
    echo "Karpenter setup complete!"
    echo ""
    echo "Verify installation:"
    echo "kubectl get nodepool"
    echo "kubectl get ec2nodeclass"
}

main "$@"
