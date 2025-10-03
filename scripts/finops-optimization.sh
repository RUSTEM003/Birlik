#!/bin/bash

set -euo pipefail

AWS_REGION=${AWS_REGION:-"us-west-2"}
CLUSTER_NAME=${CLUSTER_NAME:-"agi-portal"}

setup_cost_monitoring() {
    echo "Setting up FinOps cost monitoring..."
    
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: cost-monitoring-config
  namespace: observability
data:
  cost-rules.yaml: |
    groups:
    - name: cost.rules
      rules:
      - alert: HighCostPerHour
        expr: |
          (
            sum(rate(container_cpu_usage_seconds_total[1h])) * 0.0464 +
            sum(container_memory_usage_bytes) / 1024 / 1024 / 1024 * 0.00464
          ) > 10
        for: 5m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "High infrastructure cost per hour"
          description: "Current cost rate is \${{ \$value | humanize }}/hour"
      
      - alert: UnusedResources
        expr: |
          (
            avg_over_time(container_cpu_usage_seconds_total[24h]) < 0.1 and
            container_spec_cpu_quota > 0
          ) or (
            avg_over_time(container_memory_usage_bytes[24h]) < 
            container_spec_memory_limit_bytes * 0.2 and
            container_spec_memory_limit_bytes > 0
          )
        for: 1h
        labels:
          severity: info
          team: platform
        annotations:
          summary: "Underutilized resources detected"
          description: "Pod {{ \$labels.pod }} in namespace {{ \$labels.namespace }} is underutilized"
      
      - alert: SpotInstanceTermination
        expr: |
          increase(karpenter_nodes_terminated_total{reason="spot-interruption"}[5m]) > 0
        for: 0m
        labels:
          severity: info
          team: platform
        annotations:
          summary: "Spot instance terminated"
          description: "Spot instance terminated due to interruption"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cost-optimization-dashboard
  namespace: observability
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "AGI Portal - Cost Optimization",
        "panels": [
          {
            "title": "Hourly Cost Estimate",
            "type": "stat",
            "targets": [
              {
                "expr": "sum(rate(container_cpu_usage_seconds_total[1h])) * 0.0464 + sum(container_memory_usage_bytes) / 1024 / 1024 / 1024 * 0.00464"
              }
            ]
          },
          {
            "title": "Resource Utilization by Namespace",
            "type": "table",
            "targets": [
              {
                "expr": "sum by (namespace) (container_cpu_usage_seconds_total)"
              },
              {
                "expr": "sum by (namespace) (container_memory_usage_bytes)"
              }
            ]
          },
          {
            "title": "Spot vs On-Demand Usage",
            "type": "piechart",
            "targets": [
              {
                "expr": "count by (capacity_type) (karpenter_nodes)"
              }
            ]
          }
        ]
      }
    }
EOF
    
    echo "Cost monitoring configuration created"
}

setup_resource_quotas() {
    echo "Setting up resource quotas and limits..."
    
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ResourceQuota
metadata:
  name: agi-portal-quota
  namespace: agi-portal
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    persistentvolumeclaims: "10"
    services.loadbalancers: "2"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: agi-portal-limits
  namespace: agi-portal
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
  - max:
      cpu: "2"
      memory: "4Gi"
    min:
      cpu: "50m"
      memory: "64Mi"
    type: Container
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: agi-portal-backend-pdb
  namespace: agi-portal
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: agi-portal-backend
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: agi-portal-frontend-pdb
  namespace: agi-portal
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: agi-portal-frontend
EOF
    
    echo "Resource quotas and limits created"
}

setup_cost_allocation_tags() {
    echo "Setting up cost allocation tags..."
    
    cat << EOF | kubectl apply -f -
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-cost-allocation-labels
  annotations:
    policies.kyverno.io/title: Add Cost Allocation Labels
    policies.kyverno.io/category: FinOps
    policies.kyverno.io/severity: medium
    policies.kyverno.io/subject: Pod
    policies.kyverno.io/description: >-
      This policy adds cost allocation labels to all pods for better
      cost tracking and optimization.
spec:
  validationFailureAction: enforce
  background: true
  rules:
  - name: add-cost-labels
    match:
      any:
      - resources:
          kinds:
          - Pod
    mutate:
      patchStrategicMerge:
        metadata:
          labels:
            +(cost-center): "{{ request.namespace }}"
            +(environment): "{{ request.namespace | contains('prod') && 'production' || 'development' }}"
            +(team): "{{ request.object.metadata.labels.team || 'platform' }}"
            +(application): "{{ request.object.metadata.labels.app || 'unknown' }}"
EOF
    
    echo "Cost allocation labels policy created"
}

create_cost_optimization_cronjob() {
    echo "Creating cost optimization CronJob..."
    
    cat << EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: cost-optimization-report
  namespace: observability
spec:
  schedule: "0 8 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cost-reporter
            image: alpine/curl:latest
            command:
            - /bin/sh
            - -c
            - |
              echo "Generating daily cost report..."
              
              CPU_USAGE=\$(curl -s "http://prometheus:9090/api/v1/query?query=sum(rate(container_cpu_usage_seconds_total[24h]))" | jq -r '.data.result[0].value[1]')
              MEMORY_USAGE=\$(curl -s "http://prometheus:9090/api/v1/query?query=sum(container_memory_usage_bytes)" | jq -r '.data.result[0].value[1]')
              
              CPU_COST=\$(echo "\$CPU_USAGE * 0.0464 * 24" | bc -l)
              MEMORY_COST=\$(echo "\$MEMORY_USAGE / 1024 / 1024 / 1024 * 0.00464 * 24" | bc -l)
              TOTAL_COST=\$(echo "\$CPU_COST + \$MEMORY_COST" | bc -l)
              
              cat << EOL > /tmp/cost-report.json
              {
                "date": "\$(date -I)",
                "cluster": "${CLUSTER_NAME}",
                "estimated_daily_cost": "\$TOTAL_COST",
                "cpu_cost": "\$CPU_COST",
                "memory_cost": "\$MEMORY_COST",
                "recommendations": [
                  "Review underutilized resources",
                  "Consider spot instances for non-critical workloads",
                  "Optimize resource requests and limits"
                ]
              }
              EOL
              
              echo "Cost report generated:"
              cat /tmp/cost-report.json
              
              if [ -n "\${SLACK_WEBHOOK_URL:-}" ]; then
                curl -X POST -H 'Content-type: application/json' \
                  --data "{\"text\":\"Daily Cost Report: \\\$\$TOTAL_COST estimated for ${CLUSTER_NAME}\"}" \
                  "\$SLACK_WEBHOOK_URL"
              fi
            env:
            - name: SLACK_WEBHOOK_URL
              valueFrom:
                secretKeyRef:
                  name: alerting-webhooks
                  key: slack_webhook_url
                  optional: true
          restartPolicy: OnFailure
          serviceAccountName: cost-reporter
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cost-reporter
  namespace: observability
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cost-reporter
rules:
- apiGroups: [""]
  resources: ["pods", "nodes"]
  verbs: ["get", "list"]
- apiGroups: ["metrics.k8s.io"]
  resources: ["pods", "nodes"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cost-reporter
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cost-reporter
subjects:
- kind: ServiceAccount
  name: cost-reporter
  namespace: observability
EOF
    
    echo "Cost optimization CronJob created"
}

main() {
    echo "Setting up FinOps cost optimization..."
    
    setup_cost_monitoring
    setup_resource_quotas
    setup_cost_allocation_tags
    create_cost_optimization_cronjob
    
    echo "FinOps setup complete!"
    echo ""
    echo "Recommendations:"
    echo "1. Configure AWS Cost Explorer for detailed billing analysis"
    echo "2. Set up AWS Budgets with alerts"
    echo "3. Review Savings Plans and Reserved Instances"
    echo "4. Monitor spot instance usage and interruption rates"
    echo "5. Regularly review resource quotas and limits"
}

main "$@"
