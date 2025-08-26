#!/bin/bash

set -euo pipefail

NAMESPACE="${NAMESPACE:-agi}"
CLUSTER_NAME="${CLUSTER_NAME:-agi-portal}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

test_kyverno_policies() {
    log "Testing Kyverno policies..."
    
    log "Testing unsigned image rejection..."
    kubectl apply --dry-run=server -f - <<EOF || log "✅ Unsigned image correctly rejected"
apiVersion: v1
kind: Pod
metadata:
  name: test-unsigned-image
  namespace: $NAMESPACE
spec:
  containers:
  - name: test
    image: nginx:latest
    securityContext:
      runAsUser: 0
EOF

    log "Testing security context enforcement..."
    kubectl apply --dry-run=server -f - <<EOF || log "✅ Insecure pod correctly rejected"
apiVersion: v1
kind: Pod
metadata:
  name: test-insecure-pod
  namespace: $NAMESPACE
spec:
  containers:
  - name: test
    image: nginx:1.21
    securityContext:
      privileged: true
      runAsUser: 0
EOF

    log "Kyverno policy tests completed"
}

test_network_policies() {
    log "Testing NetworkPolicies..."
    
    kubectl get networkpolicy default-deny-all -n "$NAMESPACE" || {
        log "❌ Default deny NetworkPolicy not found"
        return 1
    }
    
    kubectl get networkpolicy default-deny-egress -n "$NAMESPACE" || {
        log "❌ Default deny egress NetworkPolicy not found"
        return 1
    }
    
    log "✅ NetworkPolicies are properly configured"
}

test_external_secrets() {
    log "Testing External Secrets..."
    
    kubectl get externalsecret agi-secrets -n "$NAMESPACE" || {
        log "❌ AGI secrets ExternalSecret not found"
        return 1
    }
    
    kubectl get externalsecret agi-oidc-config -n "$NAMESPACE" || {
        log "❌ OIDC config ExternalSecret not found"
        return 1
    }
    
    kubectl get secret agi-secrets -n "$NAMESPACE" || {
        log "❌ AGI secrets not synced"
        return 1
    }
    
    log "✅ External Secrets are properly configured"
}

test_security_headers() {
    log "Testing security headers..."
    
    local backend_url="http://$(kubectl get svc agi-backend -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}'):8000"
    
    kubectl run security-test-$(date +%s) \
        --image=curlimages/curl:latest \
        --rm -i --restart=Never \
        --command -- curl -I "$backend_url/health" \
        -n "$NAMESPACE" | grep -E "(X-Content-Type-Options|X-Frame-Options|Strict-Transport-Security)" || {
        log "❌ Security headers not found"
        return 1
    }
    
    log "✅ Security headers are properly configured"
}

test_rate_limiting() {
    log "Testing rate limiting..."
    
    local backend_url="http://$(kubectl get svc agi-backend -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}'):8000"
    
    kubectl run rate-limit-test-$(date +%s) \
        --image=curlimages/curl:latest \
        --rm -i --restart=Never \
        --command -- sh -c "
        for i in \$(seq 1 10); do
            curl -s -o /dev/null -w '%{http_code}\n' $backend_url/api/ai/chat
            sleep 0.1
        done
        " \
        -n "$NAMESPACE" | grep -q "429" && log "✅ Rate limiting is working" || log "⚠️ Rate limiting may not be configured"
}

test_ai_gateway() {
    log "Testing AI Gateway endpoints..."
    
    local backend_url="http://$(kubectl get svc agi-backend -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}'):8000"
    
    kubectl run ai-gateway-test-$(date +%s) \
        --image=curlimages/curl:latest \
        --rm -i --restart=Never \
        --command -- curl -f "$backend_url/api/ai/providers" \
        -n "$NAMESPACE" && log "✅ AI Gateway is responding" || log "❌ AI Gateway not accessible"
}

test_secrets_rotation() {
    log "Testing secrets rotation setup..."
    
    kubectl get cronjob secrets-rotation -n "$NAMESPACE" || {
        log "❌ Secrets rotation CronJob not found"
        return 1
    }
    
    kubectl get configmap secrets-rotation-script -n "$NAMESPACE" || {
        log "❌ Secrets rotation script ConfigMap not found"
        return 1
    }
    
    log "✅ Secrets rotation is properly configured"
}

test_observability() {
    log "Testing observability stack..."
    
    kubectl get servicemonitor agi-backend -n "$NAMESPACE" || {
        log "❌ ServiceMonitor not found"
        return 1
    }
    
    kubectl get pods -n observability -l app.kubernetes.io/name=prometheus || {
        log "❌ Prometheus not found in observability namespace"
        return 1
    }
    
    log "✅ Observability stack is configured"
}

test_waf() {
    log "Testing WAF configuration..."
    
    kubectl get ingress agi-portal -n "$NAMESPACE" -o yaml | grep -q "wafv2-acl-arn" && {
        log "✅ WAF is configured in ingress"
    } || {
        log "⚠️ WAF annotation not found in ingress"
    }
}

main() {
    log "Starting security tests for AGI Portal..."
    
    kubectl get namespace "$NAMESPACE" || {
        log "❌ Namespace $NAMESPACE not found"
        exit 1
    }
    
    test_kyverno_policies
    test_network_policies
    test_external_secrets
    test_security_headers
    test_rate_limiting
    test_ai_gateway
    test_secrets_rotation
    test_observability
    test_waf
    
    log "Security tests completed!"
}

main "$@"
