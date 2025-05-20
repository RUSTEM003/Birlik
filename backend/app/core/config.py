from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Birlik Digital Bank API"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    WEB3_PROVIDER_URI: str
    
    IPFS_PROJECT_ID: Optional[str] = None
    IPFS_PROJECT_SECRET: Optional[str] = None
    
    BIRLIK_LIVE_API_KEY: Optional[str] = None
    BIRLIK_LIVE_API_SECRET: Optional[str] = None
    BIRLIK_LIVE_BASE_URL: str = "https://birlik-live.onrender.com/api"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
