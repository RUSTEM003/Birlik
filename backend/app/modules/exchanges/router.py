from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.exchanges import models, schemas, services
from app.modules.identity.models import User

router = APIRouter(prefix="/api/exchanges", tags=["exchanges"])

@router.post("/", response_model=schemas.ExchangeResponse)
async def create_exchange(
    exchange_in: schemas.ExchangeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new exchange"""
    return await services.create_exchange(db, exchange_in)

@router.get("/", response_model=List[schemas.ExchangeResponse])
async def read_exchanges(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all exchanges"""
    return await services.get_exchanges(db, skip, limit)

@router.post("/rates", response_model=schemas.ExchangeRateResponse)
async def create_exchange_rate(
    rate_in: schemas.ExchangeRateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new exchange rate"""
    return await services.create_exchange_rate(db, rate_in)

@router.get("/rates/{exchange_id}", response_model=List[schemas.ExchangeRateResponse])
async def read_exchange_rates(
    exchange_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get exchange rates for a specific exchange"""
    return await services.get_exchange_rates(db, exchange_id, skip, limit)
