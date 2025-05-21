from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class RegionalCenterBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None

class RegionalCenterCreate(RegionalCenterBase):
    pass

class RegionalCenterResponse(RegionalCenterBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class NationalCenterBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    regional_center_id: int
    currency_code: str
    language_codes: List[str]

class NationalCenterCreate(NationalCenterBase):
    pass

class NationalCenterResponse(NationalCenterBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
