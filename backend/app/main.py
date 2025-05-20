from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.dfmi.router import router as dfmi_router
from app.modules.auth.router import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(dfmi_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Birlik Digital Bank API"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
