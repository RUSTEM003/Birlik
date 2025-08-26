from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class QuantumKeyCreate(BaseModel):
    algorithm: str
    key_metadata: Optional[Dict[str, Any]] = {}

class QuantumKeyResponse(BaseModel):
    id: int
    key_id: str
    algorithm: str
    public_key: bytes
    key_metadata: Dict[str, Any]
    created_at: datetime
    expires_at: Optional[datetime]
    is_active: bool

class SecurityAuditCreate(BaseModel):
    audit_type: str
    resource_accessed: str
    user_id: str
    result: str
    details: Optional[Dict[str, Any]] = {}
    threat_level: str = "low"

class SecurityAuditResponse(BaseModel):
    id: int
    audit_id: str
    audit_type: str
    resource_accessed: str
    user_id: str
    timestamp: datetime
    result: str
    details: Dict[str, Any]
    threat_level: str

class EmergencyProtocolCreate(BaseModel):
    protocol_type: str
    trigger_conditions: Dict[str, Any]
    response_actions: Dict[str, Any]

class EmergencyProtocolResponse(BaseModel):
    id: int
    protocol_id: str
    protocol_type: str
    trigger_conditions: Dict[str, Any]
    response_actions: Dict[str, Any]
    last_heartbeat: Optional[datetime]
    is_armed: bool
    created_at: datetime

class QuantumSecurityStatus(BaseModel):
    total_keys: int
    active_keys: int
    recent_audits: int
    threat_level: str
    emergency_protocols_armed: int
    last_security_scan: datetime
    quantum_resistance: str
