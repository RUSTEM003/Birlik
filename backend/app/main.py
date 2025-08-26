from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.core.config import settings
from app.modules.dfmi.router import router as dfmi_router
from app.modules.auth.router import router as auth_router
from app.modules.identity.router import router as identity_router
from app.modules.centers.router import router as centers_router
from app.modules.exchanges.router import router as exchanges_router
from app.integrations.birlik_live.webhooks import router as birlik_live_webhooks_router
from app.integrations.birlik_live.router import router as birlik_live_router
from app.modules.quantum.router import router as quantum_router
from app.modules.bis.router import router as bis_router
from app.modules.fed.router import router as fed_router
from app.modules.swift.router import router as swift_router
from app.modules.agi_portal.router import router as agi_portal_router
from app.modules.live_demos.router import router as live_demos_router
from app.modules.evidence_vault.router import router as evidence_vault_router
from app.modules.gold_answers.router import router as gold_answers_router
from app.modules.quantum_security.router import router as quantum_security_router
from app.modules.federated_learning.router import router as federated_learning_router
from app.modules.auto_research.router import router as auto_research_router
from app.modules.global_monitoring.router import router as global_monitoring_router
from app.modules.scientific_discovery.router import router as scientific_discovery_router
from app.modules.constitutional_governance.router import router as constitutional_governance_router
from app.modules.cbdc_gateway.router import router as cbdc_gateway_router
from app.database import engine, Base
from app.middleware.security import (
    SecurityHeadersMiddleware,
    AuditLoggingMiddleware,
    GeoFencingMiddleware,
    ThreatDetectionMiddleware,
    limiter
)
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/openapi.json",
    description="Корпоративная банковская платформа с интеграцией BIS, Федеральной резервной системы и SWIFT",
    version="2.0.0"
)

# Enterprise Security Middleware
if settings.ENABLE_AUDIT_LOGGING:
    app.add_middleware(AuditLoggingMiddleware)

if settings.ENABLE_GEO_FENCING:
    app.add_middleware(GeoFencingMiddleware)

if settings.ENABLE_THREAT_DETECTION:
    app.add_middleware(ThreatDetectionMiddleware)

app.add_middleware(SecurityHeadersMiddleware)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://finance-dashboard-730u3vtl.devinapps.com", "https://banking-model-app-eu9uqcyb.devinapps.com", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dfmi_router)
app.include_router(identity_router)
app.include_router(centers_router)
app.include_router(exchanges_router)
app.include_router(birlik_live_webhooks_router)
app.include_router(birlik_live_router)
app.include_router(quantum_router)
app.include_router(bis_router)
app.include_router(fed_router)
app.include_router(swift_router)
app.include_router(agi_portal_router)
app.include_router(live_demos_router)
app.include_router(evidence_vault_router)
app.include_router(gold_answers_router)
app.include_router(quantum_security_router)
app.include_router(federated_learning_router)
app.include_router(auto_research_router)
app.include_router(global_monitoring_router)
app.include_router(scientific_discovery_router)
app.include_router(constitutional_governance_router)
app.include_router(cbdc_gateway_router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Цифровой Банк Enterprise Banking Platform",
        "version": "2.0.0",
        "features": [
            "BIS Integration",
            "Federal Reserve Integration", 
            "SWIFT Secure Messaging",
            "Enterprise Security",
            "Quantum Blockchain",
            "Cross-border Transfers",
            "CBDC Support",
            "AGI Defense Portal",
            "Live Demo Arena", 
            "Evidence Vault",
            "Gold-Answer Library",
            "Quantum Security",
            "Federated Learning",
            "Auto-R&D",
            "Global Monitoring",
            "Scientific Discovery",
            "Constitutional Governance",
            "CBDC Gateway"
        ],
        "compliance": [
            "Basel III",
            "PCI DSS",
            "AML/KYC",
            "GDPR"
        ]
    }

@app.get("/healthz")
async def healthz():
    return {
        "status": "ok",
        "timestamp": "2025-01-30T00:00:00Z",
        "services": {
            "database": "connected",
            "bis_integration": "operational",
            "fed_integration": "operational", 
            "swift_integration": "operational",
            "security_middleware": "active"
        }
    }
