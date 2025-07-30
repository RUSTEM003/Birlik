from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.identity.models import User
from app.modules.quantum.schemas import (
    QuantumTransactionRequest,
    QuantumTransactionResponse,
    FinancialAdviceResponse
)
from app.services.quantum_blockchain import QuantumBlockchain
from app.services.ai_financial_advisor import FinancialAdvisor

router = APIRouter(prefix="/api/quantum", tags=["quantum"])

quantum_blockchain = QuantumBlockchain()
ai_advisor = FinancialAdvisor()

@router.post("/transaction", response_model=QuantumTransactionResponse)
async def quantum_transaction(
    request: QuantumTransactionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Process a quantum-secured transaction between users.
    """
    try:
        transaction_hash = quantum_blockchain.perform_transaction(
            request.sender_id, 
            request.receiver_id, 
            request.amount
        )
        return {"status": "completed", "transaction_hash": transaction_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/financial-advice", response_model=FinancialAdviceResponse)
async def financial_advice(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get financial advice for the current user.
    """
    try:
        advice = ai_advisor.generate_advice(current_user.id)
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
