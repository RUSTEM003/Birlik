from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class CBDCNetworkCreate(BaseModel):
    central_bank: str
    currency_code: str
    network_protocol: str
    transaction_throughput: int

class CBDCNetworkResponse(BaseModel):
    id: int
    network_id: str
    central_bank: str
    currency_code: str
    network_protocol: str
    interoperability_standard: str
    transaction_throughput: int
    settlement_time: int
    privacy_features: Dict[str, Any]
    smart_contract_support: bool
    status: str

class GlobalSmartContractCreate(BaseModel):
    contract_type: str
    participating_parties: List[str]
    contract_terms: Dict[str, Any]

class GlobalSmartContractResponse(BaseModel):
    id: int
    contract_id: str
    contract_type: str
    participating_parties: List[str]
    contract_terms: Dict[str, Any]
    execution_conditions: Dict[str, Any]
    automated_execution: bool
    governance_framework: Dict[str, Any]
    dispute_resolution: Dict[str, Any]
    status: str

class CBDCGatewayStatus(BaseModel):
    connected_networks: int
    total_transaction_volume: str
    active_smart_contracts: int
    interoperability_score: float
    settlement_efficiency: float
    supported_currencies: List[str]
    daily_throughput: str
