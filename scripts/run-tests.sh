#!/bin/bash

set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

test_backend() {
    log "Testing backend..."
    
    cd backend
    
    if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
        log "Starting backend..."
        poetry run fastapi dev app/main.py --host 0.0.0.0 --port 8000 &
        BACKEND_PID=$!
        sleep 10
    fi
    
    curl -f http://localhost:8000/health || {
        log "❌ Backend health check failed"
        return 1
    }
    
    curl -f http://localhost:8000/api/ai/providers || {
        log "❌ AI Gateway not responding"
        return 1
    }
    
    curl -f http://localhost:8000/api/media/auth -X POST -d "user=test&password=test&path=test&action=read" || {
        log "⚠️ Media auth endpoint may not be fully configured"
    }
    
    cd ..
    
    log "✅ Backend tests completed"
}

test_frontend() {
    log "Testing frontend..."
    
    cd frontend
    
    npm run build || {
        log "❌ Frontend build failed"
        return 1
    }
    
    if ! curl -f http://localhost:5173 >/dev/null 2>&1; then
        log "Starting frontend..."
        npm run dev &
        FRONTEND_PID=$!
        sleep 10
    fi
    
    curl -f http://localhost:5173 || {
        log "❌ Frontend not accessible"
        return 1
    }
    
    cd ..
    
    log "✅ Frontend tests completed"
}

test_security_policies() {
    log "Testing security policies..."
    
    if command -v conftest >/dev/null 2>&1; then
        conftest test helm/agi-portal/templates --policy platform/policies/conftest/ || {
            log "❌ Conftest policy validation failed"
            return 1
        }
    fi
    
    if command -v kube-score >/dev/null 2>&1; then
        helm template agi-portal helm/agi-portal | kube-score score - || {
            log "⚠️ kube-score found issues"
        }
    fi
    
    log "✅ Security policy tests completed"
}

test_terraform() {
    log "Testing Terraform configurations..."
    
    cd terraform/aws
    
    terraform init -backend=false
    terraform validate || {
        log "❌ Terraform validation failed"
        return 1
    }
    
    terraform fmt -check -recursive . || {
        log "❌ Terraform formatting issues found"
        return 1
    }
    
    cd ../..
    
    log "✅ Terraform tests completed"
}

test_contracts() {
    log "Testing smart contracts..."
    
    cd contracts
    
    npx hardhat compile || {
        log "❌ Contract compilation failed"
        return 1
    }
    
    npx hardhat test || {
        log "❌ Contract tests failed"
        return 1
    }
    
    cd ..
    
    log "✅ Contract tests completed"
}

main() {
    log "Starting comprehensive tests..."
    
    test_backend
    test_frontend
    test_security_policies
    test_terraform
    test_contracts
    
    log "All tests completed successfully!"
}

cleanup() {
    if [[ -n "${BACKEND_PID:-}" ]]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [[ -n "${FRONTEND_PID:-}" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

main "$@"
