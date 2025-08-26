from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class ConstitutionalAmendmentCreate(BaseModel):
    amendment_text: str
    governance_level: str
    required_approval_threshold: float
    voting_period_days: int

class ConstitutionalAmendmentResponse(BaseModel):
    id: int
    amendment_id: str
    amendment_text: str
    governance_level: str
    required_approval_threshold: float
    current_approval_rate: float
    voting_period_days: int
    citizen_jury_required: bool
    expert_panel_required: bool
    status: str
    created_at: datetime

class CitizenJuryCreate(BaseModel):
    case_type: str
    case_description: str
    deliberation_period: int

class CitizenJuryResponse(BaseModel):
    id: int
    jury_id: str
    case_type: str
    jury_members: List[str]
    case_description: str
    evidence_presented: Dict[str, Any]
    deliberation_period: int
    verdict: str
    reasoning: str
    transparency_level: str

class AIBillOfRightsCreate(BaseModel):
    right_category: str
    right_description: str
    enforcement_mechanism: Dict[str, Any]

class AIBillOfRightsResponse(BaseModel):
    id: int
    right_id: str
    right_category: str
    right_description: str
    enforcement_mechanism: Dict[str, Any]
    violation_penalties: List[str]
    monitoring_protocol: Dict[str, Any]
    compliance_status: str
    last_audit: Optional[datetime]

class ConstitutionalGovernanceStatus(BaseModel):
    active_amendments: int
    citizen_juries_active: int
    ai_rights_violations: int
    democratic_participation: float
    transparency_score: float
    governance_levels: List[str]
    oversight_mechanisms: int
