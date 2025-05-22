from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class QuantumTransactionRequest(BaseModel):
    sender_id: int
    receiver_id: int
    amount: float

class QuantumTransactionResponse(BaseModel):
    status: str
    transaction_hash: str

class FinancialAdviceResponse(BaseModel):
    advice: Dict[str, str]
    user_id: int
    generated_at: str
