from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Birlik Digital Bank API"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    WEB3_PROVIDER_URI: str
    
    XRPL_SERVER_URL: str = "https://s.altnet.rippletest.net:51234"
    DEFAULT_BLOCKCHAIN: str = "ethereum"  # "ethereum", "xrp_ledger", or "quantum"
    ENABLE_CROSS_CURRENCY: bool = False
    ENABLE_QUANTUM: bool = False
    
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
