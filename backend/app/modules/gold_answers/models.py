from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from datetime import datetime
from app.database import Base

class GoldAnswer(Base):
    __tablename__ = "gold_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, unique=True, index=True)
    panel_type = Column(String, index=True)
    question_text = Column(Text)
    answer_template = Column(Text)
    kpi_metrics = Column(JSON)
    artifact_references = Column(JSON)
    replay_command = Column(String)
    success_threshold = Column(Float)
    difficulty_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AnswerExecution(Base):
    __tablename__ = "answer_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(String, unique=True, index=True)
    question_id = Column(String, index=True)
    execution_result = Column(JSON)
    performance_score = Column(Float)
    execution_time_ms = Column(Float)
    status = Column(String)
    executed_by = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
