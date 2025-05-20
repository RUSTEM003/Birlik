from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.dfmi import schemas, services
from app.modules.auth import deps

router = APIRouter(prefix="/api/transfers", tags=["transfers"])

@router.post("/", response_model=schemas.TransactionResponse)
async def create_transfer(
    transfer: schemas.TransactionCreate,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    return await services.create_transaction(db, transfer, current_user)

@router.get("/", response_model=List[schemas.TransactionResponse])
async def get_user_transfers(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return await services.get_user_transactions(db, current_user.id, skip, limit)

@router.get("/{transfer_id}", response_model=schemas.TransactionResponse)
async def get_transfer(
    transfer_id: int,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    return await services.get_transaction(db, transfer_id, current_user)
