from sqlalchemy.orm import Session
from app.models.election import Election, Position, Candidate, ElectionStatus

class ElectionService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_current_election(self):
        election = self.db.query(Election).filter(
            Election.status == ElectionStatus.OPEN
        ).first()
        
        if not election:
            return None
        
        return {
            "id": election.id,
            "title": election.title,
            "description": election.description,
            "status": election.status
        }
    
    def get_positions_with_candidates(self, election_id):
        positions = self.db.query(Position).filter(
            Position.election_id == election_id
        ).order_by(Position.order).all()
        
        result = []
        for position in positions:
            candidates = self.db.query(Candidate).filter(
                Candidate.position_id == position.id
            ).all()
            
            result.append({
                "id": position.id,
                "name": position.name,
                "election_id": position.election_id,
                "order": position.order,
                "candidates": [
                    {"id": c.id, "name": c.name} for c in candidates
                ]
            })
        
        return result
    