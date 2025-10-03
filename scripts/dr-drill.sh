#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-agi-portal}
BACKUP_NAME=${BACKUP_NAME:-"dr-drill-$(date +%Y%m%d-%H%M%S)"}
SLACK_WEBHOOK=${SLACK_WEBHOOK:-""}

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

notify_slack() {
    local message="$1"
    local status="$2"
    
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔄 DR Drill $status: $message\"}" \
            "$SLACK_WEBHOOK"
    fi
}

check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v velero &> /dev/null; then
        log "ERROR: velero CLI not found"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log "ERROR: kubectl not found"
        exit 1
    fi
    
    if ! kubectl get namespace velero-system &> /dev/null; then
        log "ERROR: Velero not installed in cluster"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

create_backup() {
    log "Creating backup: $BACKUP_NAME"
    
    velero backup create "$BACKUP_NAME" \
        --include-namespaces="$NAMESPACE" \
        --wait
    
    local backup_status
    backup_status=$(velero backup get "$BACKUP_NAME" -o json | jq -r '.status.phase')
    
    if [[ "$backup_status" != "Completed" ]]; then
        log "ERROR: Backup failed with status: $backup_status"
        notify_slack "Backup creation failed" "FAILED"
        exit 1
    fi
    
    log "Backup created successfully"
    notify_slack "Backup $BACKUP_NAME created successfully" "SUCCESS"
}

simulate_disaster() {
    log "Simulating disaster by deleting namespace: $NAMESPACE"
    
    kubectl delete namespace "$NAMESPACE" --wait=true
    
    log "Waiting for namespace deletion to complete..."
    while kubectl get namespace "$NAMESPACE" &> /dev/null; do
        sleep 5
    done
    
    log "Disaster simulation complete"
}

restore_from_backup() {
    log "Restoring from backup: $BACKUP_NAME"
    
    velero restore create "${BACKUP_NAME}-restore" \
        --from-backup="$BACKUP_NAME" \
        --wait
    
    local restore_status
    restore_status=$(velero restore get "${BACKUP_NAME}-restore" -o json | jq -r '.status.phase')
    
    if [[ "$restore_status" != "Completed" ]]; then
        log "ERROR: Restore failed with status: $restore_status"
        notify_slack "Restore from backup failed" "FAILED"
        exit 1
    fi
    
    log "Restore completed successfully"
}

verify_restoration() {
    log "Verifying restoration..."
    
    local max_attempts=30
    local attempt=0
    
    while [[ $attempt -lt $max_attempts ]]; do
        if kubectl get namespace "$NAMESPACE" &> /dev/null; then
            log "Namespace restored successfully"
            break
        fi
        
        ((attempt++))
        log "Waiting for namespace restoration... (attempt $attempt/$max_attempts)"
        sleep 10
    done
    
    if [[ $attempt -eq $max_attempts ]]; then
        log "ERROR: Namespace not restored within timeout"
        notify_slack "Namespace restoration verification failed" "FAILED"
        exit 1
    fi
    
    log "Checking pod status..."
    kubectl wait --for=condition=Ready pods --all -n "$NAMESPACE" --timeout=300s
    
    local pod_count
    pod_count=$(kubectl get pods -n "$NAMESPACE" --no-headers | wc -l)
    
    log "Restoration verified: $pod_count pods running in namespace $NAMESPACE"
    notify_slack "DR drill completed successfully. $pod_count pods restored." "SUCCESS"
}

calculate_rto_rpo() {
    local start_time="$1"
    local end_time="$2"
    
    local rto_seconds=$((end_time - start_time))
    local rto_minutes=$((rto_seconds / 60))
    
    log "DR Drill Metrics:"
    log "  RTO (Recovery Time Objective): ${rto_minutes} minutes"
    log "  RPO (Recovery Point Objective): Based on backup frequency"
    
    echo "RTO: ${rto_minutes} minutes" > /tmp/dr-drill-metrics.txt
    echo "Backup: $BACKUP_NAME" >> /tmp/dr-drill-metrics.txt
    echo "Status: SUCCESS" >> /tmp/dr-drill-metrics.txt
}

cleanup() {
    log "Cleaning up backup: $BACKUP_NAME"
    velero backup delete "$BACKUP_NAME" --confirm
}

main() {
    local start_time
    start_time=$(date +%s)
    
    log "Starting DR drill for namespace: $NAMESPACE"
    notify_slack "Starting DR drill for namespace $NAMESPACE" "STARTED"
    
    check_prerequisites
    create_backup
    simulate_disaster
    restore_from_backup
    verify_restoration
    
    local end_time
    end_time=$(date +%s)
    
    calculate_rto_rpo "$start_time" "$end_time"
    
    if [[ "${CLEANUP_BACKUP:-true}" == "true" ]]; then
        cleanup
    fi
    
    log "DR drill completed successfully"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
