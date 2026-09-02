from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.election_service import ElectionService

router = APIRouter(prefix="/api/election", tags=["election"])

@router.get("/current")
def get_current_election(db: Session = Depends(get_db)):
    service = ElectionService(db)
    return service.get_current_election()

@router.get("/positions/{election_id}")
def get_positions_with_candidates(election_id: int, db: Session = Depends(get_db)):
    service = ElectionService(db)
    return service.get_positions_with_candidates(election_id)
