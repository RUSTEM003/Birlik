#!/bin/bash

set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-agi-portal}"
REGION="${AWS_REGION:-us-west-2}"
NAMESPACE="${NAMESPACE:-agi}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

rotate_rds_password() {
    local secret_name="$1"
    
    log "Starting RDS password rotation for secret: $secret_name"
    
    aws secretsmanager rotate-secret \
        --secret-id "$secret_name" \
        --region "$REGION" \
        --rotation-rules AutomaticallyAfterDays=30
    
    log "Waiting for rotation to complete..."
    aws secretsmanager describe-secret \
        --secret-id "$secret_name" \
        --region "$REGION" \
        --query 'RotationEnabled' \
        --output text
    
    log "RDS password rotation completed for: $secret_name"
}

rotate_redis_token() {
    local secret_name="$1"
    local redis_cluster_id="$2"
    
    log "Starting Redis auth token rotation for: $redis_cluster_id"
    
    local new_token=$(openssl rand -base64 32)
    
    aws elasticache modify-replication-group \
        --replication-group-id "$redis_cluster_id" \
        --auth-token "$new_token" \
        --auth-token-update-strategy ROTATE \
        --region "$REGION"
    
    log "Waiting for Redis modification to complete..."
    aws elasticache wait replication-group-available \
        --replication-group-ids "$redis_cluster_id" \
        --region "$REGION"
    
    aws secretsmanager update-secret \
        --secret-id "$secret_name" \
        --secret-string "{\"auth_token\":\"$new_token\"}" \
        --region "$REGION"
    
    log "Redis auth token rotation completed for: $redis_cluster_id"
}

restart_pods() {
    local deployment="$1"
    
    log "Restarting deployment: $deployment"
    
    kubectl rollout restart deployment/"$deployment" -n "$NAMESPACE"
    kubectl rollout status deployment/"$deployment" -n "$NAMESPACE" --timeout=300s
    
    log "Deployment restart completed: $deployment"
}

test_database_connection() {
    local secret_name="$1"
    
    log "Testing database connection with new credentials"
    
    local db_url=$(aws secretsmanager get-secret-value \
        --secret-id "$secret_name" \
        --region "$REGION" \
        --query 'SecretString' \
        --output text)
    
    kubectl run db-test-$(date +%s) \
        --image=postgres:15-alpine \
        --rm -i --restart=Never \
        --env="DATABASE_URL=$db_url" \
        --command -- psql "$db_url" -c "SELECT 1;" \
        -n "$NAMESPACE"
    
    log "Database connection test completed successfully"
}

test_redis_connection() {
    local secret_name="$1"
    
    log "Testing Redis connection with new credentials"
    
    local redis_url=$(aws secretsmanager get-secret-value \
        --secret-id "$secret_name" \
        --region "$REGION" \
        --query 'SecretString' \
        --output text | jq -r '.url')
    
    kubectl run redis-test-$(date +%s) \
        --image=redis:7-alpine \
        --rm -i --restart=Never \
        --command -- redis-cli -u "$redis_url" ping \
        -n "$NAMESPACE"
    
    log "Redis connection test completed successfully"
}

send_notification() {
    local message="$1"
    local webhook_url="${SLACK_WEBHOOK_URL:-}"
    
    if [[ -n "$webhook_url" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔄 Secrets Rotation: $message\"}" \
            "$webhook_url"
    fi
    
    log "Notification sent: $message"
}

main() {
    log "Starting secrets rotation workflow for cluster: $CLUSTER_NAME"
    
    if aws secretsmanager describe-secret \
        --secret-id "${CLUSTER_NAME}/backend/database_url" \
        --region "$REGION" >/dev/null 2>&1; then
        
        rotate_rds_password "${CLUSTER_NAME}/backend/database_url"
        test_database_connection "${CLUSTER_NAME}/backend/database_url"
        restart_pods "agi-backend"
        send_notification "RDS password rotation completed for $CLUSTER_NAME"
    fi
    
    if aws secretsmanager describe-secret \
        --secret-id "${CLUSTER_NAME}/redis/url" \
        --region "$REGION" >/dev/null 2>&1; then
        
        rotate_redis_token "${CLUSTER_NAME}/redis/url" "${CLUSTER_NAME}-redis"
        test_redis_connection "${CLUSTER_NAME}/redis/url"
        restart_pods "agi-backend"
        send_notification "Redis auth token rotation completed for $CLUSTER_NAME"
    fi
    
    log "Refreshing External Secrets"
    kubectl annotate externalsecret agi-secrets \
        force-sync=$(date +%s) \
        -n "$NAMESPACE" --overwrite
    
    kubectl annotate externalsecret agi-oidc-config \
        force-sync=$(date +%s) \
        -n "$NAMESPACE" --overwrite
    
    kubectl annotate externalsecret agi-ai-providers \
        force-sync=$(date +%s) \
        -n "$NAMESPACE" --overwrite
    
    log "Secrets rotation workflow completed successfully"
    send_notification "All secrets rotation completed successfully for $CLUSTER_NAME"
}

trap 'log "Error occurred during secrets rotation"; send_notification "❌ Secrets rotation failed for $CLUSTER_NAME"' ERR

main "$@"
