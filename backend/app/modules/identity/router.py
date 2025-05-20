from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.identity.models import NFTPassport, User
from app.modules.identity.schemas import NFTPassportCreate, NFTPassportResponse
from app.services.blockchain import generate_nft_token

router = APIRouter(prefix="/api/identity", tags=["identity"])

logger = logging.getLogger(__name__)

@router.post("/passport", response_model=NFTPassportResponse)
async def create_passport(
    passport_in: NFTPassportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new NFT passport for the current user"""
    result = await db.execute(
        select(NFTPassport).where(NFTPassport.owner_id == current_user.id)
    )
    existing_passport = result.scalar_one_or_none()
    
    if existing_passport:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an active passport"
        )
    
    try:
        nft_token_id = await generate_nft_token(
            owner_address=current_user.wallet_address or "default_address",
            metadata=passport_in.passport_metadata
        )
    except Exception as e:
        logger.error(f"Error generating NFT token: {str(e)}")
        nft_token_id = f"mock-token-{current_user.id}-{passport_in.passport_type}"
    
    new_passport = NFTPassport(
        owner_id=current_user.id,
        nft_token_id=nft_token_id,
        passport_type=passport_in.passport_type,
        passport_metadata=passport_in.passport_metadata,
        ipfs_hash=f"ipfs://mock-hash-{current_user.id}",  # Mock IPFS hash for testing
        is_active=True
    )
    
    db.add(new_passport)
    await db.commit()
    await db.refresh(new_passport)
    
    return new_passport

@router.get("/passport", response_model=NFTPassportResponse)
async def get_passport(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's NFT passport"""
    result = await db.execute(
        select(NFTPassport).where(NFTPassport.owner_id == current_user.id)
    )
    passport = result.scalar_one_or_none()
    
    if not passport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passport not found"
        )
    
    return passport
