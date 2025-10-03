from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import logging

from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.agi_portal import models, schemas
from app.modules.identity.models import User

router = APIRouter(prefix="/api/agi-portal", tags=["AGI Defense Portal"])
logger = logging.getLogger(__name__)

@router.get("/status", response_model=schemas.PortalStatusResponse)
async def get_portal_status():
    """Get AGI Defense Portal operational status"""
    return schemas.PortalStatusResponse(
        status="operational",
        uptime="99.999%",
        active_demos=4,
        evidence_artifacts=1250,
        gold_answers=210,
        system_health={
            "database": "healthy",
            "api": "healthy",
            "security": "active",
            "monitoring": "active"
        }
    )

@router.post("/session/start", response_model=schemas.PortalSessionResponse)
async def start_portal_session(
    session_data: schemas.PortalSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start a new AGI Defense Portal session"""
    try:
        session_id = str(uuid.uuid4())
        
        new_session = models.PortalSession(
            session_id=session_id,
            panel_type=session_data.panel_type,
            status="active",
            metrics={}
        )
        
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        
        logger.info(f"Started portal session {session_id} for panel {session_data.panel_type}")
        
        return new_session
        
    except Exception as e:
        logger.error(f"Failed to start portal session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start portal session")

@router.get("/sessions", response_model=List[schemas.PortalSessionResponse])
async def get_portal_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all portal sessions"""
    try:
        result = await db.execute(select(models.PortalSession).order_by(models.PortalSession.created_at.desc()))
        sessions = result.scalars().all()
        return sessions
        
    except Exception as e:
        logger.error(f"Failed to get portal sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get portal sessions")
