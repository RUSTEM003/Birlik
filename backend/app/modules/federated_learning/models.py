from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class FederatedNode(Base):
    __tablename__ = "federated_nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, unique=True, index=True)
    node_type = Column(String)
    location = Column(String)
    capabilities = Column(JSON)
    status = Column(String)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    performance_metrics = Column(JSON)

class FederatedModel(Base):
    __tablename__ = "federated_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(String, unique=True, index=True)
    model_type = Column(String)
    version = Column(String)
    global_weights = Column(Text)
    accuracy = Column(Float)
    training_rounds = Column(Integer)
    participating_nodes = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrainingRound(Base):
    __tablename__ = "training_rounds"
    
    id = Column(Integer, primary_key=True, index=True)
    round_id = Column(String, unique=True, index=True)
    model_id = Column(String)
    participating_nodes = Column(JSON)
    aggregated_weights = Column(Text)
    round_accuracy = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String)
