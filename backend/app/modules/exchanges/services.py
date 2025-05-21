from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.exchanges import models, schemas
from typing import List, Optional

async def create_exchange(db: AsyncSession, exchange: schemas.ExchangeCreate):
    db_exchange = models.Exchange(
        name=exchange.name,
        code=exchange.code,
        type=exchange.type,
        supported_currencies=exchange.supported_currencies
    )
    db.add(db_exchange)
    await db.commit()
    await db.refresh(db_exchange)
    return db_exchange

async def get_exchanges(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Exchange)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def create_exchange_rate(db: AsyncSession, rate: schemas.ExchangeRateCreate):
    db_rate = models.ExchangeRate(
        exchange_id=rate.exchange_id,
        from_currency=rate.from_currency,
        to_currency=rate.to_currency,
        rate=rate.rate
    )
    db.add(db_rate)
    await db.commit()
    await db.refresh(db_rate)
    return db_rate

async def get_exchange_rates(db: AsyncSession, exchange_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.ExchangeRate)
        .where(models.ExchangeRate.exchange_id == exchange_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
