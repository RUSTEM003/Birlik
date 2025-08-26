from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from datetime import datetime
from app.database import Base

class DemoExecution(Base):
    __tablename__ = "demo_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(String, unique=True, index=True)
    demo_type = Column(String, index=True)
    scenario_name = Column(String)
    input_parameters = Column(JSON)
    output_results = Column(JSON)
    execution_time_ms = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DemoMetrics(Base):
    __tablename__ = "demo_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(String, index=True)
    metric_name = Column(String)
    metric_value = Column(Float)
    metric_unit = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
