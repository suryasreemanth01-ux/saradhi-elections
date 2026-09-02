from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_token
from app.services.admin_service import AdminService
from app.schemas.admin import AdminLoginRequest
from app.schemas.voter import VoterCreate, VoterImportRequest
from app.schemas.election import ElectionCreate, PositionCreate, CandidateCreate
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_admin(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return payload

@router.post("/login")
def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    service = AdminService(db)
    admin = service.authenticate(request.email, request.password)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token = create_access_token({"sub": admin.email, "admin_id": admin.id})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/voters")
def add_voter(
    voter: VoterCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.add_voter(voter)

@router.post("/voters/import")
def import_voters(
    request: VoterImportRequest,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.import_voters(request.csv_data)

@router.get("/voters")
def get_voters(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.get_all_voters()

@router.post("/elections")
def create_election(
    election: ElectionCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.create_election(election)

@router.post("/elections/{election_id}/open")
def open_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.open_election(election_id)

@router.post("/elections/{election_id}/close")
def close_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.close_election(election_id)

@router.post("/positions")
def add_position(
    position: PositionCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.add_position(position)

@router.post("/candidates")
def add_candidate(
    candidate: CandidateCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.add_candidate(candidate)

@router.get("/results/{election_id}")
def get_results(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    service = AdminService(db)
    return service.get_results(election_id)
