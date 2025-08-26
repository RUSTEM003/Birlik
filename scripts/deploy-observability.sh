#!/bin/bash

set -euo pipefail

NAMESPACE="observability"
CLUSTER_NAME="${CLUSTER_NAME:-agi-portal}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

log "Installing OpenTelemetry Operator..."
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml

log "Installing kube-prometheus-stack..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --values - <<EOF
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    ruleSelectorNilUsesHelmValues: false
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi

grafana:
  adminPassword: $(openssl rand -base64 32)
  persistence:
    enabled: true
    storageClassName: gp3
    size: 10Gi
  sidecar:
    dashboards:
      enabled: true
      searchNamespace: ALL

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
EOF

log "Installing Loki..."
helm repo add grafana https://grafana.github.io/helm-charts
helm upgrade --install loki grafana/loki-stack \
  --namespace "$NAMESPACE" \
  --values - <<EOF
loki:
  persistence:
    enabled: true
    storageClassName: gp3
    size: 50Gi
  config:
    limits_config:
      retention_period: 168h
promtail:
  enabled: true
EOF

log "Installing Jaeger..."
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm upgrade --install jaeger jaegertracing/jaeger \
  --namespace "$NAMESPACE" \
  --values - <<EOF
storage:
  type: elasticsearch
  elasticsearch:
    host: elasticsearch-master
    port: 9200
collector:
  service:
    grpc:
      port: 14250
query:
  service:
    type: ClusterIP
EOF

log "Applying OpenTelemetry Collector..."
kubectl apply -f observability/otel-collector.yaml

log "Applying Grafana dashboards..."
kubectl apply -f observability/grafana-dashboards.yaml

log "Applying Prometheus rules..."
kubectl apply -f observability/prometheus-rules.yaml

log "Applying Alertmanager config..."
kubectl apply -f observability/alertmanager-config.yaml

log "Observability stack deployment completed!"
log "Access Grafana at: kubectl port-forward -n $NAMESPACE svc/kube-prometheus-stack-grafana 3000:80"
log "Default Grafana credentials: admin / (check secret kube-prometheus-stack-grafana)"
