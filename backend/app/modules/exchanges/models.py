from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Exchange(Base):
    __tablename__ = "exchanges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String, unique=True, index=True)
    type = Column(String)  # "digital", "real"
    supported_currencies = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    rates = relationship("ExchangeRate", back_populates="exchange")
    
class ExchangeRate(Base):
    __tablename__ = "exchange_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    exchange_id = Column(Integer, ForeignKey("exchanges.id"))
    from_currency = Column(String)
    to_currency = Column(String)
    rate = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    exchange = relationship("Exchange", back_populates="rates")
