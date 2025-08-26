from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class GoldAnswerBase(BaseModel):
    panel_type: str = Field(..., description="Panel type: nasa, fed, medicine, security")
    question_text: str
    answer_template: str
    kpi_metrics: Dict[str, Any]
    artifact_references: List[str]
    replay_command: str
    success_threshold: float = Field(ge=0.0, le=1.0)
    difficulty_level: str = Field(default="medium")

class GoldAnswerCreate(GoldAnswerBase):
    pass

class GoldAnswerResponse(GoldAnswerBase):
    id: int
    question_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AnswerExecutionResponse(BaseModel):
    execution_id: str
    question_id: str
    execution_result: Dict[str, Any]
    performance_score: float
    execution_time_ms: float
    status: str
    executed_by: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class GoldAnswerSearchResponse(BaseModel):
    total_results: int
    answers: List[GoldAnswerResponse]
    search_time_ms: float

class LibraryStatusResponse(BaseModel):
    total_questions: int
    panel_distribution: Dict[str, int]
    difficulty_distribution: Dict[str, int]
    average_success_rate: float
    recent_executions: List[str]
