from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class ResearchProjectCreate(BaseModel):
    hypothesis: str
    research_domain: str
    methodology: Dict[str, Any]

class ResearchProjectResponse(BaseModel):
    id: int
    project_id: str
    hypothesis: str
    research_domain: str
    current_phase: str
    confidence_score: float
    experiment_results: Dict[str, Any]
    created_at: datetime

class SandboxExecutionCreate(BaseModel):
    project_id: str
    code_to_execute: str
    execution_environment: str
    safety_constraints: Dict[str, Any]

class SandboxExecutionResponse(BaseModel):
    id: int
    execution_id: str
    project_id: str
    execution_environment: str
    execution_results: Dict[str, Any]
    safety_violations: List[str]
    execution_time_ms: int
    status: str
    created_at: datetime

class EvolutionaryAlgorithmCreate(BaseModel):
    population_size: int
    fitness_function: str
    mutation_rate: float
    crossover_rate: float

class EvolutionaryAlgorithmResponse(BaseModel):
    id: int
    algorithm_id: str
    population_size: int
    generation: int
    mutation_rate: float
    crossover_rate: float
    best_individual: Dict[str, Any]
    population_fitness: List[float]

class AutoResearchStatus(BaseModel):
    active_projects: int
    completed_projects: int
    sandbox_executions_today: int
    breakthrough_discoveries: int
    safety_violations: int
    evolutionary_algorithms: int
    research_domains: List[str]
