from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ExchangeBase(BaseModel):
    name: str
    code: str
    type: str  # "digital", "real"
    supported_currencies: List[str]

class ExchangeCreate(ExchangeBase):
    pass

class ExchangeResponse(ExchangeBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ExchangeRateBase(BaseModel):
    exchange_id: int
    from_currency: str
    to_currency: str
    rate: float

class ExchangeRateCreate(ExchangeRateBase):
    pass

class ExchangeRateResponse(ExchangeRateBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True
