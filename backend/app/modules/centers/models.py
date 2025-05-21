from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class RegionalCenter(Base):
    __tablename__ = "regional_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)  # e.g., "Asia", "Europe"
    name = Column(String)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    national_centers = relationship("NationalCenter", back_populates="regional_center")
    
class NationalCenter(Base):
    __tablename__ = "national_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)  # e.g., "KZ", "RU"
    name = Column(String)
    description = Column(String, nullable=True)
    regional_center_id = Column(Integer, ForeignKey("regional_centers.id"))
    currency_code = Column(String)
    language_codes = Column(JSON)  # ["kk", "ru", "en"]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    regional_center = relationship("RegionalCenter", back_populates="national_centers")
    users = relationship("User", back_populates="national_center")
