from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AGI Defense Portal"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    
    ENV: str = "dev"  # dev|prod
    RATE_LIMIT: str = "60/minute"
    
    OIDC_ISSUER: Optional[str] = None
    OIDC_AUDIENCE: Optional[str] = None
    OIDC_JWKS_URL: Optional[str] = None
    
    MEDIA_BASE_URL: str = "http://localhost:8888"
    MEDIA_AUTH_TIMEOUT: int = 3600
    
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    AI_DEFAULT_PROVIDER: str = "openai"
    
    REDIS_URL: Optional[str] = None
    
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,https://agi-portal.example.com"
    
    WEB3_PROVIDER_URI: str
    
    XRPL_SERVER_URL: str = "https://s.altnet.rippletest.net:51234"
    DEFAULT_BLOCKCHAIN: str = "ethereum"
    ENABLE_CROSS_CURRENCY: bool = True
    ENABLE_QUANTUM: bool = True
    
    IPFS_PROJECT_ID: Optional[str] = None
    IPFS_PROJECT_SECRET: Optional[str] = None
    WEB3_STORAGE_API_KEY: Optional[str] = None
    IPFS_GATEWAY: Optional[str] = "https://ipfs.io/ipfs"
    
    BIRLIK_LIVE_API_KEY: Optional[str] = None
    BIRLIK_LIVE_API_SECRET: Optional[str] = None
    BIRLIK_LIVE_BASE_URL: str = "https://birlik-live.onrender.com/api"
    
    GLOBAL_CENTER_ID: str = "GCDT"
    REGIONAL_CENTERS: List[str] = ["Asia", "Europe", "America", "Africa", "AustraliaOceania"]
    DEFAULT_REGION: str = "Asia"
    
    ENABLE_AUDIT_LOGGING: bool = True
    ENABLE_RATE_LIMITING: bool = True
    ENABLE_GEO_FENCING: bool = True
    ENABLE_ZERO_TRUST: bool = True
    ENABLE_AI_THREAT_DETECTION: bool = True
    ENABLE_THREAT_DETECTION: bool = True

    BIS_API_ENDPOINT: str = "https://api.bis.org/v1"
    FED_API_ENDPOINT: str = "https://api.federalreserve.gov/v1"
    SWIFT_SECURE_ENDPOINT: str = "https://secure.swift.com/api/v1"
    CBDC_NETWORK_ENDPOINT: str = "https://cbdc.network/api/v1"
    
    ENABLE_KYC_VERIFICATION: bool = True
    ENABLE_AML_MONITORING: bool = True
    ENABLE_SANCTIONS_SCREENING: bool = True
    REGULATORY_REPORTING_ENDPOINT: str = "https://regulatory.digital-bank.com/api/v1"
    
    PROMETHEUS_ENDPOINT: str = "http://localhost:9090"
    GRAFANA_ENDPOINT: str = "http://localhost:3000"
    ELASTICSEARCH_ENDPOINT: str = "http://localhost:9200"
    
    SECURITY_HEADERS: dict = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
