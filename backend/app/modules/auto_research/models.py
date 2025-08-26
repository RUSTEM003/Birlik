from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from datetime import datetime
from app.database import Base

class ResearchProject(Base):
    __tablename__ = "research_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True)
    hypothesis = Column(Text)
    research_domain = Column(String)
    methodology = Column(JSON)
    current_phase = Column(String)
    confidence_score = Column(Float)
    generated_code = Column(Text)
    experiment_results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class SandboxExecution(Base):
    __tablename__ = "sandbox_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(String, unique=True, index=True)
    project_id = Column(String)
    code_to_execute = Column(Text)
    execution_environment = Column(String)
    safety_constraints = Column(JSON)
    execution_results = Column(JSON)
    safety_violations = Column(JSON)
    execution_time_ms = Column(Integer)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class EvolutionaryAlgorithm(Base):
    __tablename__ = "evolutionary_algorithms"
    
    id = Column(Integer, primary_key=True, index=True)
    algorithm_id = Column(String, unique=True, index=True)
    population_size = Column(Integer)
    generation = Column(Integer)
    fitness_function = Column(Text)
    mutation_rate = Column(Float)
    crossover_rate = Column(Float)
    best_individual = Column(JSON)
    population_fitness = Column(JSON)
    evolution_history = Column(JSON)
