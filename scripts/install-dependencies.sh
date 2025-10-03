#!/bin/bash

set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

install_backend_deps() {
    log "Installing backend dependencies..."
    
    cd backend
    poetry install
    cd ..
    
    log "Backend dependencies installed"
}

install_frontend_deps() {
    log "Installing frontend dependencies..."
    
    cd frontend
    npm install
    cd ..
    
    log "Frontend dependencies installed"
}

install_contracts_deps() {
    log "Installing contracts dependencies..."
    
    cd contracts
    npm install
    cd ..
    
    log "Contracts dependencies installed"
}

install_security_tools() {
    log "Installing security tools..."
    
    if ! command -v conftest >/dev/null 2>&1; then
        curl -L https://github.com/open-policy-agent/conftest/releases/latest/download/conftest_Linux_x86_64.tar.gz | tar xz
        sudo mv conftest /usr/local/bin/
    fi
    
    if ! command -v kube-score >/dev/null 2>&1; then
        curl -L https://github.com/zegl/kube-score/releases/latest/download/kube-score_Linux_x86_64.tar.gz | tar xz
        sudo mv kube-score /usr/local/bin/
    fi
    
    if ! command -v polaris >/dev/null 2>&1; then
        curl -L https://github.com/FairwindsOps/polaris/releases/latest/download/polaris_linux_amd64.tar.gz | tar xz
        sudo mv polaris /usr/local/bin/
    fi
    
    log "Security tools installed"
}

main() {
    log "Starting dependency installation..."
    
    install_backend_deps
    install_frontend_deps
    install_contracts_deps
    install_security_tools
    
    log "All dependencies installed successfully!"
}

main "$@"
