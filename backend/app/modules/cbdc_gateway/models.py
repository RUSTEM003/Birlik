from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class CBDCNetwork(Base):
    __tablename__ = "cbdc_networks"
    
    id = Column(Integer, primary_key=True, index=True)
    network_id = Column(String, unique=True, index=True)
    central_bank = Column(String)
    currency_code = Column(String)
    network_protocol = Column(String)
    interoperability_standard = Column(String)
    transaction_throughput = Column(Integer)
    settlement_time = Column(Integer)
    privacy_features = Column(JSON)
    smart_contract_support = Column(Boolean, default=False)
    status = Column(String)

class GlobalSmartContract(Base):
    __tablename__ = "global_smart_contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, unique=True, index=True)
    contract_type = Column(String)
    participating_parties = Column(JSON)
    contract_terms = Column(JSON)
    execution_conditions = Column(JSON)
    automated_execution = Column(Boolean, default=True)
    governance_framework = Column(JSON)
    dispute_resolution = Column(JSON)
    status = Column(String)
