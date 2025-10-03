from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from datetime import datetime
from app.database import Base

class EvidenceArtifact(Base):
    __tablename__ = "evidence_artifacts"
    
    id = Column(Integer, primary_key=True, index=True)
    artifact_id = Column(String, unique=True, index=True)
    panel_category = Column(String, index=True)
    artifact_type = Column(String)
    file_path = Column(String)
    file_hash = Column(String)
    file_size = Column(Integer)
    artifact_metadata = Column(JSON)
    replay_script = Column(Text)
    verification_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

class ArtifactVerification(Base):
    __tablename__ = "artifact_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    artifact_id = Column(String, index=True)
    verification_hash = Column(String)
    verification_method = Column(String)
    verification_result = Column(Boolean)
    verification_details = Column(JSON)
    verified_by = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
