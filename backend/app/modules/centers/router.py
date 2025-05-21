from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.centers import models, schemas, services
from app.modules.identity.models import User

router = APIRouter(prefix="/api/centers", tags=["centers"])

@router.post("/regional", response_model=schemas.RegionalCenterResponse)
async def create_regional_center(
    center_in: schemas.RegionalCenterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new regional center"""
    return await services.create_regional_center(db, center_in)

@router.get("/regional", response_model=List[schemas.RegionalCenterResponse])
async def read_regional_centers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all regional centers"""
    return await services.get_regional_centers(db, skip, limit)

@router.post("/national", response_model=schemas.NationalCenterResponse)
async def create_national_center(
    center_in: schemas.NationalCenterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new national center"""
    return await services.create_national_center(db, center_in)

@router.get("/national", response_model=List[schemas.NationalCenterResponse])
async def read_national_centers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all national centers"""
    return await services.get_national_centers(db, skip, limit)
