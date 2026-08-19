from fastapi import FastAPI, Depends, HTTPException  # type: ignore[import]
from sqlalchemy.orm import Session  # type: ignore[reportMissingImports]
from database import Base, engine, sessionlocal
import models, schemas
from ai_engine import generate_phishing_email
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # type: ignore[reportMissingImports]

Base.metadata.create_all(bind=engine)
app= FastAPI(title="Adaptive Security Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db=sessionlocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return{"message": "Adaptive Security Platform API is running."}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user:schemas.UserCreate, db: Session=Depends(get_db)):
    db_user=models.User(
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session=Depends(get_db)):
    return db.query(models.User).all()


@app.post("/campaigns/", response_model=schemas.CampaignResponse)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = models.Campaign(
        title=campaign.title,
        description=campaign.description,
        is_active=True          
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

@app.get("/campaigns/", response_model=list[schemas.CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).all()


class PhishingRequest(BaseModel):
    employee_name: str
    department: str = "General"
    company: str = "Our Company"

@app.post("/generate-phishing/")
def create_phishing_email(request: PhishingRequest):
    email_content = generate_phishing_email(
        employee_name=request.employee_name,
        department=request.department,
        company=request.company
    )
    return {
        "status": "success",
        "employee_name": request.employee_name,
        "department": request.department,
        "company": request.company,
        "generated_email": email_content
    }


class RiskUpdate(BaseModel):
    user_id: int
    clicked: bool
    reported: bool=False

@app.post("/update-risk/")
def update_user_risk(data: RiskUpdate, db: Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.id==data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.clicked:
        user.risk_score=min(100, user.risk_score+15)
    elif data.reported:
        user.risk_score=max(0, user.risk_score-10)
    else:
        user.risk_score=max(0, user.risk_score-5)
    db.commit()
    db.refresh(user)

    return{
        "user_id":user.id,
        "full_name":user.full_name,
        "new_risk_score":user.risk_score,
        "message":"Risk score updated successfully."
    }


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    db.delete(campaign)
    db.commit()
    return {"message": "Campaign deleted successfully"}






