from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class PortalSessionBase(BaseModel):
    panel_type: str = Field(..., description="Panel type: nasa, fed, medicine, security")
    
class PortalSessionCreate(PortalSessionBase):
    pass

class PortalSessionResponse(PortalSessionBase):
    id: int
    session_id: str
    status: str
    metrics: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PortalStatusResponse(BaseModel):
    status: str
    uptime: str
    active_demos: int
    evidence_artifacts: int
    gold_answers: int
    system_health: Dict[str, str]
