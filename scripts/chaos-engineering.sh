#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-"agi-portal"}
CHAOS_NAMESPACE=${CHAOS_NAMESPACE:-"litmus"}

install_litmus() {
    echo "Installing LitmusChaos..."
    
    kubectl create namespace "$CHAOS_NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm
    helm repo update
    
    helm upgrade --install litmus litmuschaos/litmus \
        --namespace "$CHAOS_NAMESPACE" \
        --set portal.frontend.service.type=ClusterIP \
        --set portal.server.service.type=ClusterIP
    
    echo "LitmusChaos installed successfully"
}

create_chaos_experiments() {
    echo "Creating chaos experiments..."
    
    cat << EOF | kubectl apply -f -
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: agi-portal-pod-delete
  namespace: ${NAMESPACE}
spec:
  appinfo:
    appns: ${NAMESPACE}
    applabel: "app=agi-portal-backend"
    appkind: "deployment"
  chaosServiceAccount: litmus-admin
  experiments:
  - name: pod-delete
    spec:
      components:
        env:
        - name: TOTAL_CHAOS_DURATION
          value: '30'
        - name: CHAOS_INTERVAL
          value: '10'
        - name: FORCE
          value: 'false'
        - name: PODS_AFFECTED_PERC
          value: '50'
      probe:
      - name: "check-agi-portal-access-url"
        type: "httpProbe"
        mode: "Continuous"
        runProperties:
          probeTimeout: 10
          retry: 3
          interval: 2
          probePollingInterval: 2
        httpProbe/inputs:
          url: "http://agi-portal-backend:8000/health"
          insecureSkipTLS: true
          method:
            get:
              criteria: ==
              responseCode: "200"
---
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: agi-portal-network-loss
  namespace: ${NAMESPACE}
spec:
  appinfo:
    appns: ${NAMESPACE}
    applabel: "app=agi-portal-backend"
    appkind: "deployment"
  chaosServiceAccount: litmus-admin
  experiments:
  - name: pod-network-loss
    spec:
      components:
        env:
        - name: TOTAL_CHAOS_DURATION
          value: '60'
        - name: NETWORK_PACKET_LOSS_PERCENTAGE
          value: '50'
        - name: CONTAINER_RUNTIME
          value: 'containerd'
        - name: SOCKET_PATH
          value: '/run/containerd/containerd.sock'
      probe:
      - name: "check-agi-portal-latency"
        type: "httpProbe"
        mode: "Continuous"
        runProperties:
          probeTimeout: 30
          retry: 3
          interval: 5
          probePollingInterval: 2
        httpProbe/inputs:
          url: "http://agi-portal-backend:8000/health"
          insecureSkipTLS: true
          method:
            get:
              criteria: ==
              responseCode: "200"
---
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: agi-portal-memory-stress
  namespace: ${NAMESPACE}
spec:
  appinfo:
    appns: ${NAMESPACE}
    applabel: "app=agi-portal-backend"
    appkind: "deployment"
  chaosServiceAccount: litmus-admin
  experiments:
  - name: pod-memory-hog
    spec:
      components:
        env:
        - name: TOTAL_CHAOS_DURATION
          value: '60'
        - name: MEMORY_CONSUMPTION
          value: '500'
        - name: NUMBER_OF_WORKERS
          value: '1'
      probe:
      - name: "check-agi-portal-memory-usage"
        type: "promProbe"
        mode: "Edge"
        runProperties:
          probeTimeout: 5
          retry: 3
          interval: 2
        promProbe/inputs:
          endpoint: "http://prometheus:9090"
          query: "container_memory_usage_bytes{pod=~'agi-portal-backend.*'}/1024/1024"
          comparator:
            type: "float"
            criteria: "<"
            value: "1000"
EOF
    
    echo "Chaos experiments created successfully"
}

create_chaos_rbac() {
    echo "Creating chaos RBAC..."
    
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: litmus-admin
  namespace: ${NAMESPACE}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: litmus-admin
rules:
- apiGroups: [""]
  resources: ["pods","events","configmaps","secrets","pods/log","pods/exec"]
  verbs: ["create","delete","get","list","patch","update","deletecollection"]
- apiGroups: ["apps"]
  resources: ["deployments","daemonsets","replicasets","statefulsets"]
  verbs: ["list","get","patch","update","create","delete"]
- apiGroups: ["argoproj.io"]
  resources: ["rollouts"]
  verbs: ["list","get","patch","update"]
- apiGroups: ["batch"]
  resources: ["jobs"]
  verbs: ["create","list","get","delete","deletecollection"]
- apiGroups: ["litmuschaos.io"]
  resources: ["chaosengines","chaosexperiments","chaosresults"]
  verbs: ["create","delete","get","list","patch","update","deletecollection"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["patch","get","list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: litmus-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: litmus-admin
subjects:
- kind: ServiceAccount
  name: litmus-admin
  namespace: ${NAMESPACE}
EOF
    
    echo "Chaos RBAC created successfully"
}

create_chaos_schedule() {
    echo "Creating chaos schedule..."
    
    cat << EOF | kubectl apply -f -
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: agi-portal-chaos-schedule
  namespace: ${NAMESPACE}
spec:
  schedule:
    now: false
    repeat:
      timeRange:
        startTime: "02:00"
        endTime: "04:00"
      workDays:
        includedDays: "Mon,Tue,Wed,Thu,Fri"
  engineTemplateSpec:
    appinfo:
      appns: ${NAMESPACE}
      applabel: "app=agi-portal-backend"
      appkind: "deployment"
    chaosServiceAccount: litmus-admin
    experiments:
    - name: pod-delete
      spec:
        components:
          env:
          - name: TOTAL_CHAOS_DURATION
            value: '30'
          - name: CHAOS_INTERVAL
            value: '10'
          - name: FORCE
            value: 'false'
          - name: PODS_AFFECTED_PERC
            value: '25'
EOF
    
    echo "Chaos schedule created successfully"
}

main() {
    echo "Setting up Chaos Engineering with LitmusChaos..."
    
    install_litmus
    create_chaos_rbac
    create_chaos_experiments
    create_chaos_schedule
    
    echo "Chaos Engineering setup complete!"
    echo ""
    echo "Verify installation:"
    echo "kubectl get chaosengines -n ${NAMESPACE}"
    echo "kubectl get chaosschedules -n ${NAMESPACE}"
    echo ""
    echo "Access Litmus Portal:"
    echo "kubectl port-forward -n ${CHAOS_NAMESPACE} svc/litmusportal-frontend-service 9091:9091"
}

main "$@"
