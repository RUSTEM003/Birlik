from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.core.config import settings
from app.modules.dfmi.router import router as dfmi_router
from app.modules.auth.router import router as auth_router
from app.modules.identity.router import router as identity_router
from app.modules.centers.router import router as centers_router
from app.modules.exchanges.router import router as exchanges_router
from app.modules.payments.router import router as payments_router
from app.integrations.birlik_live.webhooks import router as birlik_live_webhooks_router
from app.integrations.birlik_live.router import router as birlik_live_router
from app.modules.quantum.router import router as quantum_router
from app.database import engine, Base

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://banking-model-app-eu9uqcyb.devinapps.com", "http://localhost:5173"],  # Frontend domains
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(dfmi_router)
app.include_router(identity_router)
app.include_router(centers_router)
app.include_router(exchanges_router)
app.include_router(payments_router)
app.include_router(birlik_live_webhooks_router)
app.include_router(birlik_live_router)
app.include_router(quantum_router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created")

@app.get("/")
async def root():
    return {"message": "Welcome to Birlik Digital Bank API"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
