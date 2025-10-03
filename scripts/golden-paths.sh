#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-"agi-portal"}

create_service_template() {
    echo "Creating Golden Path service template..."
    
    mkdir -p templates/golden-path-service
    
    cat << EOF > templates/golden-path-service/Chart.yaml
apiVersion: v2
name: golden-path-service
description: Golden Path template for AGI Portal microservices
type: application
version: 0.1.0
appVersion: "1.0.0"
EOF
    
    cat << EOF > templates/golden-path-service/values.yaml
service:
  name: ""
  port: 8080
  targetPort: 8080
  type: ClusterIP

image:
  repository: ""
  tag: "latest"
  pullPolicy: IfNotPresent

replicaCount: 2

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

security:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL

monitoring:
  enabled: true
  path: /metrics
  port: 8080

healthChecks:
  liveness:
    path: /health
    port: 8080
    initialDelaySeconds: 30
    periodSeconds: 10
  readiness:
    path: /ready
    port: 8080
    initialDelaySeconds: 5
    periodSeconds: 5

networkPolicy:
  enabled: true
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: agi-portal
      ports:
      - protocol: TCP
        port: 8080

podDisruptionBudget:
  enabled: true
  minAvailable: 1

serviceAccount:
  create: true
  annotations: {}

secrets:
  external:
    enabled: true
    secretStore: "aws-secrets-manager"

observability:
  tracing:
    enabled: true
    jaeger:
      endpoint: "http://jaeger-collector:14268/api/traces"
  logging:
    enabled: true
    level: "info"
    format: "json"
EOF
    
    mkdir -p templates/golden-path-service/templates
    
    cat << EOF > templates/golden-path-service/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.service.name }}
  namespace: {{ .Release.Namespace }}
  labels:
    app: {{ .Values.service.name }}
    version: {{ .Values.image.tag }}
    team: {{ .Values.team | default "platform" }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Values.service.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.service.name }}
        version: {{ .Values.image.tag }}
        team: {{ .Values.team | default "platform" }}
      annotations:
        prometheus.io/scrape: "{{ .Values.monitoring.enabled }}"
        prometheus.io/path: "{{ .Values.monitoring.path }}"
        prometheus.io/port: "{{ .Values.monitoring.port }}"
        spiffe.io/spiffe-id: "spiffe://agi-portal.com/{{ .Release.Namespace }}/{{ .Values.service.name }}"
    spec:
      serviceAccountName: {{ .Values.service.name }}
      securityContext:
        runAsNonRoot: {{ .Values.security.runAsNonRoot }}
        runAsUser: {{ .Values.security.runAsUser }}
        fsGroup: {{ .Values.security.runAsUser }}
      containers:
      - name: {{ .Values.service.name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.service.targetPort }}
          protocol: TCP
        livenessProbe:
          httpGet:
            path: {{ .Values.healthChecks.liveness.path }}
            port: {{ .Values.healthChecks.liveness.port }}
          initialDelaySeconds: {{ .Values.healthChecks.liveness.initialDelaySeconds }}
          periodSeconds: {{ .Values.healthChecks.liveness.periodSeconds }}
        readinessProbe:
          httpGet:
            path: {{ .Values.healthChecks.readiness.path }}
            port: {{ .Values.healthChecks.readiness.port }}
          initialDelaySeconds: {{ .Values.healthChecks.readiness.initialDelaySeconds }}
          periodSeconds: {{ .Values.healthChecks.readiness.periodSeconds }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        securityContext:
          runAsNonRoot: {{ .Values.security.runAsNonRoot }}
          runAsUser: {{ .Values.security.runAsUser }}
          readOnlyRootFilesystem: {{ .Values.security.readOnlyRootFilesystem }}
          allowPrivilegeEscalation: {{ .Values.security.allowPrivilegeEscalation }}
          capabilities:
            {{- toYaml .Values.security.capabilities | nindent 12 }}
        env:
        - name: SERVICE_NAME
          value: {{ .Values.service.name }}
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        {{- if .Values.observability.tracing.enabled }}
        - name: JAEGER_ENDPOINT
          value: {{ .Values.observability.tracing.jaeger.endpoint }}
        {{- end }}
        {{- if .Values.observability.logging.enabled }}
        - name: LOG_LEVEL
          value: {{ .Values.observability.logging.level }}
        - name: LOG_FORMAT
          value: {{ .Values.observability.logging.format }}
        {{- end }}
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: var-run
          mountPath: /var/run
        {{- if .Values.secrets.external.enabled }}
        - name: secrets
          mountPath: /etc/secrets
          readOnly: true
        {{- end }}
      volumes:
      - name: tmp
        emptyDir: {}
      - name: var-run
        emptyDir: {}
      {{- if .Values.secrets.external.enabled }}
      - name: secrets
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: {{ .Values.service.name }}-secrets
      {{- end }}
EOF
    
    echo "Golden Path service template created"
}

create_security_checklist() {
    echo "Creating security checklist..."
    
    cat << EOF > templates/SECURITY_CHECKLIST.md


- [ ] Base image is from approved registry
- [ ] Image is scanned for vulnerabilities (Snyk/Trivy)
- [ ] No secrets in container image
- [ ] Container runs as non-root user
- [ ] Read-only root filesystem enabled
- [ ] All capabilities dropped
- [ ] Resource limits defined

- [ ] NetworkPolicy defined and tested
- [ ] Ingress/egress rules are minimal
- [ ] Service mesh (Istio) configured for mTLS
- [ ] No direct internet access (egress through proxy)

- [ ] ServiceAccount with minimal permissions
- [ ] RBAC rules follow principle of least privilege
- [ ] SPIFFE/SPIRE identity configured
- [ ] External secrets integration configured

- [ ] Prometheus metrics exposed
- [ ] Structured logging implemented
- [ ] Distributed tracing configured
- [ ] Health checks implemented
- [ ] SLO/SLI defined

- [ ] Encryption at rest configured
- [ ] Encryption in transit (TLS/mTLS)
- [ ] PII data handling compliant
- [ ] Backup and recovery tested

- [ ] Security policies (Kyverno/OPA) pass
- [ ] Vulnerability scan results reviewed
- [ ] Penetration testing completed
- [ ] Compliance requirements met (SOC2, ISO27001)

- [ ] Runbook created and tested
- [ ] Alerting configured
- [ ] Escalation procedures defined
- [ ] Recovery procedures documented


- [ ] Security scan in production
- [ ] Network policies tested
- [ ] Access controls verified
- [ ] Monitoring alerts functional

- [ ] Load testing completed
- [ ] Chaos engineering tests passed
- [ ] Backup/restore verified
- [ ] Disaster recovery tested

- [ ] Documentation updated
- [ ] Team training completed
- [ ] Support procedures in place
- [ ] Monitoring dashboards configured
EOF
    
    echo "Security checklist created"
}

create_runbook_template() {
    echo "Creating runbook template..."
    
    cat << EOF > templates/RUNBOOK_TEMPLATE.md

- **Service Name**: {{ SERVICE_NAME }}
- **Team**: {{ TEAM }}
- **Repository**: {{ REPOSITORY_URL }}
- **Documentation**: {{ DOCS_URL }}

- **Technology Stack**: {{ TECH_STACK }}
- **Dependencies**: {{ DEPENDENCIES }}
- **Data Stores**: {{ DATA_STORES }}

- **Dashboards**: {{ DASHBOARD_URLS }}
- **Key Metrics**: {{ KEY_METRICS }}
- **SLO/SLI**: {{ SLO_SLI }}
- **Alert Channels**: {{ ALERT_CHANNELS }}


**Symptoms**: CPU utilization > 80%
**Investigation**:
1. Check Grafana dashboard for CPU metrics
2. Review application logs for errors
3. Check for memory leaks

**Resolution**:
1. Scale horizontally if needed
2. Optimize application code
3. Adjust resource limits

**Symptoms**: Memory utilization > 90%
**Investigation**:
1. Check memory metrics in Grafana
2. Review heap dumps if available
3. Check for memory leaks

**Resolution**:
1. Restart pods if memory leak suspected
2. Increase memory limits
3. Optimize application memory usage

**Symptoms**: Health checks failing, 5xx errors
**Investigation**:
1. Check pod status: \`kubectl get pods -n {{ NAMESPACE }}\`
2. Review pod logs: \`kubectl logs -n {{ NAMESPACE }} -l app={{ SERVICE_NAME }}\`
3. Check service endpoints: \`kubectl get endpoints -n {{ NAMESPACE }}\`

**Resolution**:
1. Restart unhealthy pods
2. Check resource constraints
3. Verify external dependencies

**Symptoms**: Database connection errors in logs
**Investigation**:
1. Check database connectivity
2. Verify credentials and secrets
3. Check network policies

**Resolution**:
1. Verify database is accessible
2. Rotate credentials if needed
3. Update network policies


1. Create feature branch
2. Run tests and security scans
3. Create pull request
4. Deploy to staging
5. Run integration tests
6. Deploy to production
7. Monitor deployment

1. Identify issue and impact
2. Execute rollback: \`helm rollback {{ SERVICE_NAME }} -n {{ NAMESPACE }}\`
3. Verify service health
4. Communicate status to stakeholders

1. **Immediate Response**: Scale to zero if security incident
2. **Incident Commander**: {{ INCIDENT_COMMANDER }}
3. **Communication**: Use {{ COMMUNICATION_CHANNEL }}
4. **Escalation**: {{ ESCALATION_CONTACTS }}


- [ ] Weekly: Review logs and metrics
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security review
- [ ] Annually: Disaster recovery test

- **Backup Schedule**: {{ BACKUP_SCHEDULE }}
- **Recovery Time Objective**: {{ RTO }}
- **Recovery Point Objective**: {{ RPO }}
- **Recovery Procedures**: {{ RECOVERY_PROCEDURES }}

- **Primary On-Call**: {{ PRIMARY_ONCALL }}
- **Secondary On-Call**: {{ SECONDARY_ONCALL }}
- **Team Lead**: {{ TEAM_LEAD }}
- **Product Owner**: {{ PRODUCT_OWNER }}


\`\`\`bash
kubectl get pods -n {{ NAMESPACE }} -l app={{ SERVICE_NAME }}

kubectl logs -n {{ NAMESPACE }} -l app={{ SERVICE_NAME }} --tail=100

kubectl port-forward -n {{ NAMESPACE }} svc/{{ SERVICE_NAME }} 8080:8080

kubectl exec -it -n {{ NAMESPACE }} deployment/{{ SERVICE_NAME }} -- /bin/sh
\`\`\`

\`\`\`bash
curl http://{{ SERVICE_NAME }}.{{ NAMESPACE }}.svc.cluster.local:8080/metrics

curl http://{{ SERVICE_NAME }}.{{ NAMESPACE }}.svc.cluster.local:8080/health
\`\`\`
EOF
    
    echo "Runbook template created"
}

main() {
    echo "Setting up Golden Paths for AGI Portal..."
    
    create_service_template
    create_security_checklist
    create_runbook_template
    
    echo "Golden Paths setup complete!"
    echo ""
    echo "Templates created in templates/ directory:"
    echo "- golden-path-service/ - Helm chart template"
    echo "- SECURITY_CHECKLIST.md - Security checklist"
    echo "- RUNBOOK_TEMPLATE.md - Runbook template"
    echo ""
    echo "Usage:"
    echo "1. Copy golden-path-service template for new services"
    echo "2. Customize values.yaml for your service"
    echo "3. Follow security checklist before deployment"
    echo "4. Create runbook using template"
}

main "$@"
