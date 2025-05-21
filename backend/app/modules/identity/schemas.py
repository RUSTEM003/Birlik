from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class NFTPassportBase(BaseModel):
    passport_type: str = Field(..., description="Type of passport: citizen, government, corporation, international")
    
class NFTPassportCreate(NFTPassportBase):
    passport_metadata: Dict[str, Any] = Field(
        ..., 
        description="Additional metadata for the passport"
    )

class NFTPassportResponse(NFTPassportBase):
    id: int
    owner_id: int
    nft_token_id: str
    passport_metadata: Dict[str, Any]
    ipfs_hash: Optional[str] = None
    blockchain_verified: bool
    global_status: str
    regional_status: str
    national_status: str
    is_active: bool
    issued_at: datetime
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
