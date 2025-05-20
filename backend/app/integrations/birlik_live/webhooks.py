"""
Birlik Live Webhook Handlers

This module provides webhook handlers for the Birlik Live platform.
"""
import logging
import json
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional

from app.database import get_db
from app.integrations.birlik_live.auth import BirlikLiveAuth
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/webhooks/birlik-live", tags=["webhooks"])

@router.post("/transaction")
async def transaction_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle transaction webhooks from Birlik Live.
    
    Args:
        request: HTTP request.
        db: Database session.
        
    Returns:
        Acknowledgement response.
    """
    try:
        payload = await request.json()
        signature = request.headers.get("X-Birlik-Signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing signature"
            )
        
        auth = BirlikLiveAuth()
        if not auth.verify_webhook_signature(payload, signature):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature"
            )
        
        transaction_type = payload.get("type")
        transaction_data = payload.get("data", {})
        
        logger.info(f"Received transaction webhook: {transaction_type}")
        logger.info(f"Transaction data: {transaction_data}")
        
        if transaction_type == "transfer.created":
            await _handle_transfer_created(db, transaction_data)
        elif transaction_type == "transfer.completed":
            await _handle_transfer_completed(db, transaction_data)
        elif transaction_type == "transfer.failed":
            await _handle_transfer_failed(db, transaction_data)
        
        return {"status": "success"}
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )
    except Exception as e:
        logger.error(f"Error processing transaction webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )

@router.post("/identity")
async def identity_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle identity webhooks from Birlik Live.
    
    Args:
        request: HTTP request.
        db: Database session.
        
    Returns:
        Acknowledgement response.
    """
    try:
        payload = await request.json()
        signature = request.headers.get("X-Birlik-Signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing signature"
            )
        
        auth = BirlikLiveAuth()
        if not auth.verify_webhook_signature(payload, signature):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature"
            )
        
        identity_type = payload.get("type")
        identity_data = payload.get("data", {})
        
        logger.info(f"Received identity webhook: {identity_type}")
        logger.info(f"Identity data: {identity_data}")
        
        if identity_type == "passport.created":
            await _handle_passport_created(db, identity_data)
        elif identity_type == "passport.verified":
            await _handle_passport_verified(db, identity_data)
        elif identity_type == "passport.revoked":
            await _handle_passport_revoked(db, identity_data)
        
        return {"status": "success"}
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )
    except Exception as e:
        logger.error(f"Error processing identity webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )


async def _handle_transfer_created(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle transfer.created webhook.
    
    Args:
        db: Database session.
        data: Transaction data.
    """
    logger.info(f"Handling transfer.created: {data}")

async def _handle_transfer_completed(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle transfer.completed webhook.
    
    Args:
        db: Database session.
        data: Transaction data.
    """
    logger.info(f"Handling transfer.completed: {data}")

async def _handle_transfer_failed(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle transfer.failed webhook.
    
    Args:
        db: Database session.
        data: Transaction data.
    """
    logger.info(f"Handling transfer.failed: {data}")


async def _handle_passport_created(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle passport.created webhook.
    
    Args:
        db: Database session.
        data: Identity data.
    """
    logger.info(f"Handling passport.created: {data}")

async def _handle_passport_verified(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle passport.verified webhook.
    
    Args:
        db: Database session.
        data: Identity data.
    """
    logger.info(f"Handling passport.verified: {data}")

async def _handle_passport_revoked(db: AsyncSession, data: Dict[str, Any]):
    """
    Handle passport.revoked webhook.
    
    Args:
        db: Database session.
        data: Identity data.
    """
    logger.info(f"Handling passport.revoked: {data}")
