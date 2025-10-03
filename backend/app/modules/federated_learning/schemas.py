from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class FederatedNodeCreate(BaseModel):
    node_type: str
    location: str
    capabilities: Dict[str, Any]

class FederatedNodeResponse(BaseModel):
    id: int
    node_id: str
    node_type: str
    location: str
    capabilities: Dict[str, Any]
    status: str
    last_heartbeat: datetime
    performance_metrics: Dict[str, Any]

class FederatedModelCreate(BaseModel):
    model_type: str
    version: str

class FederatedModelResponse(BaseModel):
    id: int
    model_id: str
    model_type: str
    version: str
    accuracy: float
    training_rounds: int
    participating_nodes: List[str]
    created_at: datetime

class TrainingRoundCreate(BaseModel):
    model_id: str
    participating_nodes: List[str]

class TrainingRoundResponse(BaseModel):
    id: int
    round_id: str
    model_id: str
    participating_nodes: List[str]
    round_accuracy: float
    start_time: datetime
    end_time: Optional[datetime]
    status: str

class FederatedLearningStatus(BaseModel):
    total_nodes: int
    active_nodes: int
    global_models: int
    training_rounds_today: int
    average_accuracy: float
    network_throughput: str
