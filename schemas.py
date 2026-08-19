from pydantic import BaseModel, EmailStr #type: ignore[reportMissingImports]
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    role: str="employee"

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    risk_score: int
    created_at: datetime

    class Config:
        from_attributes=True

class CampaignCreate(BaseModel):
    title: str
    description: Optional[str]=None

class CampaignResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]=None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes=True
