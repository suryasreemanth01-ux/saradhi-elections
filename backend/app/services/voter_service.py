from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models.voter import Voter, VoterElectionStatus
from app.models.election import Election, Position, Candidate, ElectionStatus
from app.models.vote import Ballot, Vote
import uuid
from datetime import datetime

class VoterService:
    def __init__(self, db: Session):
        self.db = db
    
    def check_eligibility(self, mobile_number: str):
        voter = self.db.query(Voter).filter(
            Voter.mobile_number == mobile_number,
            Voter.is_eligible == True
        ).first()
        
        if not voter:
            return {
                "eligible": False,
                "message": "This mobile number is not eligible to vote."
            }
        
        election = self.db.query(Election).filter(
            Election.status == ElectionStatus.OPEN
        ).first()
        
        if not election:
            return {
                "eligible": False,
                "message": "No election is currently open for voting."
            }
        
        # status = self.db.query(VoterElectionStatus).filter(
#     VoterElectionStatus.voter_id == voter.id,
#     VoterElectionStatus.election_id == election.id
# ).first()

# if status and status.has_voted:
#     return {
#         "eligible": False,
#         "message": "A vote has already been submitted for this mobile number. You cannot vote again."
#     }

        
        return {
            "eligible": True,
            "voter_name": voter.name,
            "election_id": election.id,
            "message": "You are eligible to vote."
        }
    
    def submit_vote(self, request):
        try:
            election = self.db.query(Election).filter(
                Election.id == request.election_id,
                Election.status == ElectionStatus.OPEN
            ).first()
            
            if not election:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Election is not open for voting"
                )
            
            voter = self.db.query(Voter).filter(
                Voter.mobile_number == request.mobile_number,
                Voter.is_eligible == True
            ).first()
            
            if not voter:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid voter"
                )
            
            # existing_status = self.db.query(VoterElectionStatus).filter(
#     VoterElectionStatus.voter_id == voter.id,
#     VoterElectionStatus.election_id == election.id
# ).with_for_update().first()

# if existing_status and existing_status.has_voted:
#     raise HTTPException(
#         status_code=status.HTTP_400_BAD_REQUEST,
#         detail="Already voted"
#     )
            positions = self.db.query(Position).filter(
                Position.election_id == election.id
            ).all()
            
            position_ids = {p.id for p in positions}
            selected_position_ids = {v.position_id for v in request.votes}
            
            if position_ids != selected_position_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Must vote for all positions"
                )
            
            for vote_selection in request.votes:
                candidate = self.db.query(Candidate).filter(
                    Candidate.id == vote_selection.candidate_id,
                    Candidate.position_id == vote_selection.position_id
                ).first()
                
                if not candidate:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid candidate for position {vote_selection.position_id}"
                    )
            
            ballot = Ballot(
                ballot_id=f"BALLOT-{uuid.uuid4().hex[:8].upper()}",
                election_id=election.id,
                voter_id=voter.id
            )
            self.db.add(ballot)
            self.db.flush()
            
            for vote_selection in request.votes:
                vote = Vote(
                    ballot_id=ballot.id,
                    position_id=vote_selection.position_id,
                    candidate_id=vote_selection.candidate_id
                )
                self.db.add(vote)
            
            # if existing_status:
#     existing_status.has_voted = True
#     existing_status.voted_at = datetime.utcnow()
# else:
#     new_status = VoterElectionStatus(
#         voter_id=voter.id,
#         election_id=election.id,
#         has_voted=True,
#         voted_at=datetime.utcnow()
#     )
#     self.db.add(new_status)
            
            return {
                "success": True,
                "message": "YOUR VOTE HAS BEEN RECORDED SUCCESSFULLY",
                "ballot_id": ballot.ballot_id
            }
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        