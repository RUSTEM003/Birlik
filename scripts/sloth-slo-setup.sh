#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-"observability"}

install_sloth() {
    echo "Installing Sloth SLO generator..."
    
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    helm repo add sloth https://slok.github.io/sloth
    helm repo update
    
    helm upgrade --install sloth sloth/sloth \
        --namespace "$NAMESPACE" \
        --set image.tag="v0.11.0" \
        --set prometheus.url="http://prometheus:9090"
    
    echo "Sloth installed successfully"
}

create_slo_definitions() {
    echo "Creating SLO definitions..."
    
    cat << EOF | kubectl apply -f -
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: agi-portal-api-slo
  namespace: ${NAMESPACE}
spec:
  service: "agi-portal-api"
  labels:
    team: "platform"
    service: "agi-portal"
  slos:
    - name: "requests-availability"
      objective: 99.9
      description: "99.9% of requests should be successful"
      sli:
        events:
          error_query: sum(rate(http_requests_total{job="agi-portal-backend",code=~"5.."}[5m]))
          total_query: sum(rate(http_requests_total{job="agi-portal-backend"}[5m]))
      alerting:
        name: AGIPortalAPIHighErrorRate
        labels:
          category: "availability"
        annotations:
          summary: "AGI Portal API error rate is above SLO"
        page_alert:
          labels:
            severity: "critical"
        ticket_alert:
          labels:
            severity: "warning"
    
    - name: "requests-latency"
      objective: 95.0
      description: "95% of requests should complete within 500ms"
      sli:
        events:
          error_query: sum(rate(http_request_duration_seconds_bucket{job="agi-portal-backend",le="0.5"}[5m]))
          total_query: sum(rate(http_request_duration_seconds_count{job="agi-portal-backend"}[5m]))
      alerting:
        name: AGIPortalAPIHighLatency
        labels:
          category: "latency"
        annotations:
          summary: "AGI Portal API latency is above SLO"
        page_alert:
          labels:
            severity: "critical"
        ticket_alert:
          labels:
            severity: "warning"
---
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: agi-portal-ai-gateway-slo
  namespace: ${NAMESPACE}
spec:
  service: "agi-portal-ai-gateway"
  labels:
    team: "ai"
    service: "ai-gateway"
  slos:
    - name: "ai-requests-availability"
      objective: 99.5
      description: "99.5% of AI requests should be successful"
      sli:
        events:
          error_query: sum(rate(ai_gateway_requests_total{status=~"error|timeout"}[5m]))
          total_query: sum(rate(ai_gateway_requests_total[5m]))
      alerting:
        name: AIGatewayHighErrorRate
        labels:
          category: "availability"
        annotations:
          summary: "AI Gateway error rate is above SLO"
        page_alert:
          labels:
            severity: "critical"
        ticket_alert:
          labels:
            severity: "warning"
    
    - name: "ai-requests-latency"
      objective: 90.0
      description: "90% of AI requests should complete within 10s"
      sli:
        events:
          error_query: sum(rate(ai_gateway_request_duration_seconds_bucket{le="10"}[5m]))
          total_query: sum(rate(ai_gateway_request_duration_seconds_count[5m]))
      alerting:
        name: AIGatewayHighLatency
        labels:
          category: "latency"
        annotations:
          summary: "AI Gateway latency is above SLO"
        page_alert:
          labels:
            severity: "critical"
        ticket_alert:
          labels:
            severity: "warning"
EOF
    
    echo "SLO definitions created successfully"
}

create_error_budget_alerts() {
    echo "Creating error budget alerts..."
    
    cat << EOF | kubectl apply -f -
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: slo-error-budget-alerts
  namespace: ${NAMESPACE}
spec:
  groups:
  - name: slo.error_budget
    rules:
    - alert: SLOErrorBudgetBurn
      expr: |
        (
          slo:sli_error:ratio_rate5m{sloth_service="agi-portal-api"} > (14.4 * 0.001)
          and
          slo:sli_error:ratio_rate1h{sloth_service="agi-portal-api"} > (14.4 * 0.001)
        )
        or
        (
          slo:sli_error:ratio_rate30m{sloth_service="agi-portal-api"} > (6 * 0.001)
          and
          slo:sli_error:ratio_rate6h{sloth_service="agi-portal-api"} > (6 * 0.001)
        )
      for: 2m
      labels:
        severity: critical
        sloth_service: agi-portal-api
      annotations:
        summary: "High error budget burn rate for AGI Portal API"
        description: "Error budget is burning too fast. Current burn rate will exhaust the budget in less than 2 days."
    
    - alert: SLOErrorBudgetExhausted
      expr: slo:error_budget:ratio{sloth_service="agi-portal-api"} < 0.1
      for: 5m
      labels:
        severity: warning
        sloth_service: agi-portal-api
      annotations:
        summary: "Error budget nearly exhausted for AGI Portal API"
        description: "Less than 10% of error budget remaining for this SLO period."
EOF
    
    echo "Error budget alerts created successfully"
}

main() {
    echo "Setting up Sloth SLO monitoring..."
    
    install_sloth
    create_slo_definitions
    create_error_budget_alerts
    
    echo "Sloth SLO setup complete!"
    echo ""
    echo "Verify installation:"
    echo "kubectl get prometheusservicelevel -n ${NAMESPACE}"
    echo "kubectl get prometheusrule -n ${NAMESPACE}"
}

main "$@"
