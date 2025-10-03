from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class GlobalThreat(Base):
    __tablename__ = "global_threats"
    
    id = Column(Integer, primary_key=True, index=True)
    threat_id = Column(String, unique=True, index=True)
    threat_type = Column(String)
    severity_level = Column(Integer)
    geographic_scope = Column(JSON)
    detection_source = Column(String)
    threat_description = Column(Text)
    predicted_impact = Column(JSON)
    mitigation_strategies = Column(JSON)
    status = Column(String)
    detected_at = Column(DateTime, default=datetime.utcnow)

class ClimateMonitoring(Base):
    __tablename__ = "climate_monitoring"
    
    id = Column(Integer, primary_key=True, index=True)
    monitoring_id = Column(String, unique=True, index=True)
    data_source = Column(String)
    location = Column(JSON)
    temperature = Column(Float)
    co2_levels = Column(Float)
    sea_level = Column(Float)
    weather_patterns = Column(JSON)
    anomaly_detected = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class PandemicEarlyWarning(Base):
    __tablename__ = "pandemic_early_warning"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True)
    pathogen_type = Column(String)
    geographic_origin = Column(JSON)
    transmission_rate = Column(Float)
    mortality_rate = Column(Float)
    symptoms_profile = Column(JSON)
    containment_measures = Column(JSON)
    vaccine_development_timeline = Column(Integer)
    alert_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
