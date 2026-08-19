from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey  # type: ignore[reportMissingImports]
from sqlalchemy.orm import relationship  # type: ignore[reportMissingImports]
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"
    id= Column(Integer, primary_key=True, index=True)
    email= Column(String, unique=True, index=True, nullable=False)
    full_name= Column(String, nullable=False)
    role= Column(String, default="employee", nullable=False)
    risk_score= Column(Integer, default=50, nullable=False)
    created_at= Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

class Campaign(Base):
    __tablename__ = "campaigns"
    id= Column(Integer, primary_key=True, index=True)
    title= Column(String, nullable=False)
    description= Column(Text, nullable=True)
    created_at= Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    is_active= Column(Boolean, default=True, nullable=False)

class SimulationResult(Base):
    __tablename__ = "simulation_results"
    id= Column(Integer, primary_key=True, index=True)
    user_id= Column(Integer, ForeignKey("users.id"), nullable=False)
    campaign_id= Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    clicked= Column(Boolean, default= False, nullable=False)
    reported= Column(Boolean, default= False, nullable=False)
    completed_at= Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
