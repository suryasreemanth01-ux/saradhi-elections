from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import voter_router, admin_router, election_router
from app.core.config import settings
from app.core.database import engine
from app.models import admin, voter, election, vote

# Create tables
admin.Base.metadata.create_all(bind=engine)
voter.Base.metadata.create_all(bind=engine)
election.Base.metadata.create_all(bind=engine)
vote.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Saradhi Elections API",
    description="Colony Election Voting System",
    version="1.0.0"
)

# CORS settings - Allow all origins for Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(voter_router)
app.include_router(admin_router)
app.include_router(election_router)

@app.get("/create-admin")
def create_admin():
    from app.core.database import SessionLocal
    from app.models.admin import Admin
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.email == "admin@example.com").first()
        if admin:
            return {"message": "Admin already exists"}
        
        admin = Admin(
            email="admin@example.com",
            password_hash=get_password_hash("admin123")
        )
        db.add(admin)
        db.commit()
        return {"message": "Admin created successfully"}
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Saradhi Elections API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
