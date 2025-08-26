from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class DemoExecutionBase(BaseModel):
    demo_type: str = Field(..., description="Demo type: space, economy, medicine, security")
    scenario_name: str
    input_parameters: Optional[Dict[str, Any]] = None

class DemoExecutionCreate(DemoExecutionBase):
    pass

class DemoExecutionResponse(DemoExecutionBase):
    id: int
    execution_id: str
    output_results: Optional[Dict[str, Any]] = None
    execution_time_ms: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SpaceDemoResponse(BaseModel):
    trajectory: str
    landing_accuracy: str
    fuel_efficiency: str
    status: str
    telemetry: Dict[str, Any]

class EconomyDemoResponse(BaseModel):
    transactions_per_second: str
    latency: str
    success_rate: str
    status: str
    stress_metrics: Dict[str, Any]

class MedicineDemoResponse(BaseModel):
    compounds_analyzed: int
    promising_candidates: int
    time_to_discovery: str
    status: str
    discovery_metrics: Dict[str, Any]

class SecurityDemoResponse(BaseModel):
    attack_vectors_tested: int
    vulnerabilities_found: int
    defense_effectiveness: str
    status: str
    security_metrics: Dict[str, Any]
