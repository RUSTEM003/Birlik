from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class ConstitutionalAmendment(Base):
    __tablename__ = "constitutional_amendments"
    
    id = Column(Integer, primary_key=True, index=True)
    amendment_id = Column(String, unique=True, index=True)
    amendment_text = Column(Text)
    governance_level = Column(String)
    required_approval_threshold = Column(Float)
    current_approval_rate = Column(Float)
    voting_period_days = Column(Integer)
    citizen_jury_required = Column(Boolean, default=False)
    expert_panel_required = Column(Boolean, default=False)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class CitizenJury(Base):
    __tablename__ = "citizen_juries"
    
    id = Column(Integer, primary_key=True, index=True)
    jury_id = Column(String, unique=True, index=True)
    case_type = Column(String)
    jury_members = Column(JSON)
    case_description = Column(Text)
    evidence_presented = Column(JSON)
    deliberation_period = Column(Integer)
    verdict = Column(String)
    reasoning = Column(Text)
    transparency_level = Column(String)

class AIBillOfRights(Base):
    __tablename__ = "ai_bill_of_rights"
    
    id = Column(Integer, primary_key=True, index=True)
    right_id = Column(String, unique=True, index=True)
    right_category = Column(String)
    right_description = Column(Text)
    enforcement_mechanism = Column(JSON)
    violation_penalties = Column(JSON)
    monitoring_protocol = Column(JSON)
    compliance_status = Column(String)
    last_audit = Column(DateTime)
