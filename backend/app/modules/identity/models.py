from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class NFTPassport(Base):
    __tablename__ = "nft_passports"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    nft_token_id = Column(String, unique=True)
    passport_type = Column(String)  # "citizen", "government", "corporation", "international"
    passport_metadata = Column(JSON)
    ipfs_hash = Column(String)
    blockchain_verified = Column(Boolean, default=False)
    global_status = Column(String, default="pending")  # "pending", "verified", "rejected"
    regional_status = Column(String, default="pending")  # "pending", "verified", "rejected"
    national_status = Column(String, default="pending")  # "pending", "verified", "rejected"
    is_active = Column(Boolean, default=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    owner = relationship("User", back_populates="passport")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    wallet_address = Column(String, nullable=True)
    global_citizen_id = Column(String, unique=True, nullable=True)
    national_center_id = Column(Integer, ForeignKey("national_centers.id"))
    preferred_language = Column(String, default="en")  # "en", "ru", "kk"
    
    passport = relationship("NFTPassport", back_populates="owner")
    national_center = relationship("NationalCenter", back_populates="users")
