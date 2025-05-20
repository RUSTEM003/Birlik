from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TransactionBase(BaseModel):
    sender: Optional[str] = None
    recipient: str
    amount: float = Field(gt=0)
    currency: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    blockchain_tx_hash: Optional[str] = None
    status: str
    fee: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CurrencyBase(BaseModel):
    code: str
    name: str
    is_cbdc: bool = False
    is_crypto: bool = False
    is_fiat: bool = False
    blockchain_address: Optional[str] = None
    exchange_rate_to_tenge: float

class CurrencyCreate(CurrencyBase):
    pass

class CurrencyResponse(CurrencyBase):
    id: int

    class Config:
        from_attributes = True
