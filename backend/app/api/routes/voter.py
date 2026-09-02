from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.voter_service import VoterService
from app.schemas.voter import VoterCheckRequest, VoteSubmitRequest

router = APIRouter(prefix="/api/voter", tags=["voter"])

@router.post("/check-eligibility")
def check_eligibility(
    request: VoterCheckRequest,
    db: Session = Depends(get_db)
):
    """Check if a mobile number is eligible to vote"""
    service = VoterService(db)
    return service.check_eligibility(request.mobile_number)

@router.post("/submit-vote")
def submit_vote(
    request: VoteSubmitRequest,
    db: Session = Depends(get_db)
):
    """Submit a vote - uses database transaction to prevent double voting"""
    service = VoterService(db)
    return service.submit_vote(request)
