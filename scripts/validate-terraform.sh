#!/bin/bash

set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

validate_terraform() {
    log "Validating Terraform configurations..."
    
    cd terraform/aws
    
    terraform init -backend=false
    
    terraform validate
    
    terraform fmt -check -recursive .
    
    terraform plan \
        -var="cluster_name=test-cluster" \
        -var="region=us-west-2" \
        -var="db_password=dummy-password" \
        -var="redis_auth_token=dummy-token" \
        -var="backend_secret_key=dummy-secret" \
        -var="domain_name=test.example.com" \
        -out=tfplan
    
    log "✅ Terraform validation completed successfully"
    
    cd ../..
}

validate_helm() {
    log "Validating Helm charts..."
    
    helm lint helm/agi-portal
    
    helm template agi-portal helm/agi-portal \
        --values helm/agi-portal/values.yaml \
        --set global.domain=test.example.com \
        --set image.backend.repository=test/backend \
        --set image.frontend.repository=test/frontend \
        > /tmp/rendered-manifests.yaml
    
    kubectl apply --dry-run=client -f /tmp/rendered-manifests.yaml
    
    log "✅ Helm chart validation completed successfully"
}

validate_policies() {
    log "Validating security policies..."
    
    if command -v kubectl >/dev/null 2>&1; then
        for policy in platform/policies/kyverno/*.yaml; do
            kubectl apply --dry-run=client -f "$policy"
        done
    fi
    
    if command -v conftest >/dev/null 2>&1; then
        conftest verify --policy platform/policies/conftest/
    fi
    
    log "✅ Policy validation completed successfully"
}

main() {
    log "Starting infrastructure validation..."
    
    validate_terraform
    validate_helm
    validate_policies
    
    log "All validations completed successfully!"
}

main "$@"
