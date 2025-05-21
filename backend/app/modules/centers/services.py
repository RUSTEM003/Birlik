from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.centers import models, schemas
from typing import List, Optional

async def create_regional_center(db: AsyncSession, center: schemas.RegionalCenterCreate):
    db_center = models.RegionalCenter(
        code=center.code,
        name=center.name,
        description=center.description
    )
    db.add(db_center)
    await db.commit()
    await db.refresh(db_center)
    return db_center

async def get_regional_centers(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.RegionalCenter)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def create_national_center(db: AsyncSession, center: schemas.NationalCenterCreate):
    db_center = models.NationalCenter(
        code=center.code,
        name=center.name,
        description=center.description,
        regional_center_id=center.regional_center_id,
        currency_code=center.currency_code,
        language_codes=center.language_codes
    )
    db.add(db_center)
    await db.commit()
    await db.refresh(db_center)
    return db_center

async def get_national_centers(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.NationalCenter)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
