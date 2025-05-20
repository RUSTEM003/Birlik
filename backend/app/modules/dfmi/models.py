from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, index=True)
    recipient = Column(String, index=True)
    amount = Column(Float)
    currency = Column(String)
    blockchain_tx_hash = Column(String, nullable=True)
    status = Column(String)  # "pending", "completed", "failed"
    fee = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Currency(Base):
    __tablename__ = "currencies"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    is_cbdc = Column(Boolean, default=False)
    is_crypto = Column(Boolean, default=False)
    is_fiat = Column(Boolean, default=False)
    blockchain_address = Column(String, nullable=True)
    exchange_rate_to_tenge = Column(Float)
