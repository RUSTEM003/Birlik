from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class GlobalThreatCreate(BaseModel):
    threat_type: str
    severity_level: int
    geographic_scope: Dict[str, Any]
    threat_description: str
    detection_source: str

class GlobalThreatResponse(BaseModel):
    id: int
    threat_id: str
    threat_type: str
    severity_level: int
    geographic_scope: Dict[str, Any]
    threat_description: str
    predicted_impact: Dict[str, Any]
    mitigation_strategies: List[str]
    status: str
    detected_at: datetime

class ClimateMonitoringCreate(BaseModel):
    data_source: str
    location: Dict[str, float]
    temperature: float
    co2_levels: float
    sea_level: float

class ClimateMonitoringResponse(BaseModel):
    id: int
    monitoring_id: str
    data_source: str
    location: Dict[str, float]
    temperature: float
    co2_levels: float
    sea_level: float
    weather_patterns: Dict[str, Any]
    anomaly_detected: bool
    timestamp: datetime

class PandemicEarlyWarningCreate(BaseModel):
    pathogen_type: str
    geographic_origin: Dict[str, Any]
    transmission_rate: float
    mortality_rate: float

class PandemicEarlyWarningResponse(BaseModel):
    id: int
    alert_id: str
    pathogen_type: str
    geographic_origin: Dict[str, Any]
    transmission_rate: float
    mortality_rate: float
    symptoms_profile: Dict[str, Any]
    containment_measures: List[str]
    vaccine_development_timeline: int
    alert_level: str
    created_at: datetime

class GlobalMonitoringStatus(BaseModel):
    active_threats: int
    climate_anomalies: int
    pandemic_alerts: int
    nuclear_monitoring: str
    cyber_threat_level: str
    global_stability_index: float
    monitoring_sources: int
