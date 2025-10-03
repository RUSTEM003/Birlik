from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class EvidenceArtifactBase(BaseModel):
    panel_category: str = Field(..., description="Panel category: space, economy, medicine, security")
    artifact_type: str = Field(..., description="Artifact type: video, log, report, simulation")
    metadata: Optional[Dict[str, Any]] = None

class EvidenceArtifactCreate(EvidenceArtifactBase):
    pass

class EvidenceArtifactResponse(EvidenceArtifactBase):
    id: int
    artifact_id: str
    file_path: str
    file_hash: str
    file_size: int
    replay_script: Optional[str] = None
    verification_status: bool
    created_at: datetime
    verified_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ArtifactVerificationResponse(BaseModel):
    artifact_id: str
    verification_hash: str
    verification_method: str
    verification_result: bool
    verification_details: Dict[str, Any]
    verified_by: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class VaultStatusResponse(BaseModel):
    total_artifacts: int
    verified_artifacts: int
    storage_used_gb: float
    categories: Dict[str, int]
    recent_uploads: List[str]
