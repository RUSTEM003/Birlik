from sqlalchemy.orm import Session
from sqlalchemy.future import select
from typing import List, Optional
from datetime import datetime
from app.modules.dfmi import models, schemas
from app.services import blockchain

async def create_transaction(db: Session, transaction: schemas.TransactionCreate, current_user):
    """Create a new transaction"""
    db_transaction = models.Transaction(
        sender=current_user.wallet_address if not transaction.sender else transaction.sender,
        recipient=transaction.recipient,
        amount=transaction.amount,
        currency=transaction.currency,
        status="pending",
        fee=calculate_fee(transaction.amount, transaction.currency),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    
    if transaction.currency in ["CBDC_KZT", "ETH", "BTC"]:
        blockchain_result = await blockchain.send_transaction(
            from_address=db_transaction.sender,
            to_address=db_transaction.recipient,
            amount=db_transaction.amount,
            private_key="0x0"  # This would be securely retrieved in a real implementation
        )
        
        if blockchain_result["success"]:
            db_transaction.blockchain_tx_hash = blockchain_result["tx_hash"]
            db_transaction.status = "completed"
        else:
            db_transaction.status = "failed"
        
        await db.commit()
        await db.refresh(db_transaction)
    else:
        db_transaction.status = "completed"
        await db.commit()
        await db.refresh(db_transaction)
    
    return db_transaction

async def get_user_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Get all transactions for a user"""
    user = await db.get(models.User, user_id)
    if not user:
        return []
    
    query = select(models.Transaction).where(
        (models.Transaction.sender == user.wallet_address) | 
        (models.Transaction.recipient == user.wallet_address)
    ).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

async def get_transaction(db: Session, transaction_id: int, current_user):
    """Get a specific transaction"""
    transaction = await db.get(models.Transaction, transaction_id)
    if not transaction:
        return None
    
    if transaction.sender != current_user.wallet_address and transaction.recipient != current_user.wallet_address:
        return None
    
    return transaction

def calculate_fee(amount: float, currency: str) -> float:
    """Calculate transaction fee based on amount and currency"""
    base_fee_percentage = 0.001  # 0.1%
    
    if currency == "KZT":
        return amount * base_fee_percentage
    elif currency == "CBDC_KZT":
        return amount * (base_fee_percentage / 2)  # Lower fees for CBDC
    elif currency in ["ETH", "BTC"]:
        return amount * (base_fee_percentage * 2)  # Higher fees for crypto
    else:
        return amount * (base_fee_percentage * 1.5)  # Higher fees for foreign currencies
