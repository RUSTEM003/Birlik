from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class ScientificHypothesis(Base):
    __tablename__ = "scientific_hypotheses"
    
    id = Column(Integer, primary_key=True, index=True)
    hypothesis_id = Column(String, unique=True, index=True)
    research_field = Column(String)
    hypothesis_text = Column(Text)
    mathematical_formulation = Column(Text)
    testable_predictions = Column(JSON)
    confidence_score = Column(Float)
    generated_by = Column(String)
    validation_status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class ExperimentDesign(Base):
    __tablename__ = "experiment_designs"
    
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(String, unique=True, index=True)
    hypothesis_id = Column(String)
    experimental_setup = Column(JSON)
    required_equipment = Column(JSON)
    methodology = Column(Text)
    expected_outcomes = Column(JSON)
    safety_protocols = Column(JSON)
    estimated_duration = Column(Integer)
    cost_estimate = Column(Float)
    approval_status = Column(String)

class DiscoveryBreakthrough(Base):
    __tablename__ = "discovery_breakthroughs"
    
    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(String, unique=True, index=True)
    discovery_type = Column(String)
    significance_score = Column(Float)
    discovery_description = Column(Text)
    supporting_evidence = Column(JSON)
    reproducibility_status = Column(String)
    potential_applications = Column(JSON)
    publication_status = Column(String)
    discovered_at = Column(DateTime, default=datetime.utcnow)
