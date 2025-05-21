from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    preferred_language: Optional[str] = "en"
    national_center_id: Optional[int] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    wallet_address: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    wallet_address: Optional[str] = None
    global_citizen_id: Optional[str] = None

    class Config:
        from_attributes = True
