from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class ScientificHypothesisCreate(BaseModel):
    research_field: str
    hypothesis_text: str
    mathematical_formulation: str
    testable_predictions: List[str]

class ScientificHypothesisResponse(BaseModel):
    id: int
    hypothesis_id: str
    research_field: str
    hypothesis_text: str
    mathematical_formulation: str
    testable_predictions: List[str]
    confidence_score: float
    generated_by: str
    validation_status: str
    created_at: datetime

class ExperimentDesignCreate(BaseModel):
    hypothesis_id: str
    experimental_setup: Dict[str, Any]
    methodology: str
    estimated_duration: int

class ExperimentDesignResponse(BaseModel):
    id: int
    experiment_id: str
    hypothesis_id: str
    experimental_setup: Dict[str, Any]
    required_equipment: List[str]
    methodology: str
    expected_outcomes: Dict[str, Any]
    safety_protocols: List[str]
    estimated_duration: int
    cost_estimate: float
    approval_status: str

class DiscoveryBreakthroughCreate(BaseModel):
    discovery_type: str
    discovery_description: str
    supporting_evidence: Dict[str, Any]

class DiscoveryBreakthroughResponse(BaseModel):
    id: int
    discovery_id: str
    discovery_type: str
    significance_score: float
    discovery_description: str
    supporting_evidence: Dict[str, Any]
    reproducibility_status: str
    potential_applications: List[str]
    publication_status: str
    discovered_at: datetime

class ScientificDiscoveryStatus(BaseModel):
    active_hypotheses: int
    validated_hypotheses: int
    ongoing_experiments: int
    breakthrough_discoveries: int
    research_fields: List[str]
    reproducibility_rate: float
    publication_rate: float
