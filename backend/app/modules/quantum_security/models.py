from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, LargeBinary
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class QuantumKey(Base):
    __tablename__ = "quantum_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key_id = Column(String, unique=True, index=True)
    algorithm = Column(String)  # "CRYSTALS-Kyber", "CRYSTALS-Dilithium", etc.
    public_key = Column(LargeBinary)
    private_key_encrypted = Column(LargeBinary)
    key_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)

class SecurityAudit(Base):
    __tablename__ = "security_audits"
    
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(String, unique=True, index=True)
    audit_type = Column(String)  # "access", "encryption", "verification"
    resource_accessed = Column(String)
    user_id = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    result = Column(String)  # "success", "failure", "suspicious"
    details = Column(JSON)
    threat_level = Column(String)  # "low", "medium", "high", "critical"

class EmergencyProtocol(Base):
    __tablename__ = "emergency_protocols"
    
    id = Column(Integer, primary_key=True, index=True)
    protocol_id = Column(String, unique=True, index=True)
    protocol_type = Column(String)  # "dead_mans_switch", "emergency_shutdown"
    trigger_conditions = Column(JSON)
    response_actions = Column(JSON)
    last_heartbeat = Column(DateTime)
    is_armed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
