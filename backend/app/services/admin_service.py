from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models.admin import Admin
from app.models.voter import Voter, VoterElectionStatus
from app.models.election import Election, Position, Candidate, ElectionStatus
from app.models.vote import Ballot, Vote
from app.core.security import get_password_hash, verify_password
import pandas as pd
from io import StringIO
from datetime import datetime

class AdminService:
    def __init__(self, db: Session):
        self.db = db
    
    def authenticate(self, email: str, password: str):
        admin = self.db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            return None
        if not verify_password(password, admin.password_hash):
            return None
        return admin
    
    def add_voter(self, voter_data):
        existing = self.db.query(Voter).filter(
            Voter.mobile_number == voter_data.mobile_number
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number already exists"
            )
        
        voter = Voter(
            name=voter_data.name,
            mobile_number=voter_data.mobile_number,
            house_number=voter_data.house_number
        )
        self.db.add(voter)
        self.db.commit()
        self.db.refresh(voter)
        return voter
    
    def import_voters(self, csv_data):
        try:
            df = pd.read_csv(StringIO(csv_data))
            required_cols = ['name', 'mobile_number']
            
            if not all(col in df.columns for col in required_cols):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="CSV must have 'name' and 'mobile_number' columns"
                )
            
            added = 0
            errors = []
            
            for _, row in df.iterrows():
                try:
                    mobile = str(row['mobile_number']).strip()
                    if len(mobile) != 10:
                        errors.append(f"{mobile}: Invalid number length")
                        continue
                    
                    existing = self.db.query(Voter).filter(
                        Voter.mobile_number == mobile
                    ).first()
                    
                    if existing:
                        errors.append(f"{mobile}: Already exists")
                        continue
                    
                    voter = Voter(
                        name=str(row['name']).strip(),
                        mobile_number=mobile,
                        house_number=str(row.get('house_number', '')).strip() if pd.notna(row.get('house_number')) else None
                    )
                    self.db.add(voter)
                    added += 1
                    
                except Exception as e:
                    errors.append(f"Row {_}: {str(e)}")
            
            self.db.commit()
            
            return {
                "added": added,
                "errors": errors,
                "total": len(df)
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error importing CSV: {str(e)}"
            )
    
    def get_all_voters(self):
        return self.db.query(Voter).all()
    
    def create_election(self, election_data):
        election = Election(
            title=election_data.title,
            description=election_data.description
        )
        self.db.add(election)
        self.db.commit()
        self.db.refresh(election)
        return election
    
    def open_election(self, election_id):
        election = self.db.query(Election).filter(Election.id == election_id).first()
        if not election:
            raise HTTPException(status_code=404, detail="Election not found")
        election.status = ElectionStatus.OPEN
        self.db.commit()
        return {"message": "Election opened successfully"}
    
    def close_election(self, election_id):
        election = self.db.query(Election).filter(Election.id == election_id).first()
        if not election:
            raise HTTPException(status_code=404, detail="Election not found")
        election.status = ElectionStatus.CLOSED
        self.db.commit()
        return {"message": "Election closed successfully"}
    
    def add_position(self, position_data):
        position = Position(
            name=position_data.name,
            election_id=position_data.election_id,
            order=position_data.order
        )
        self.db.add(position)
        self.db.commit()
        self.db.refresh(position)
        return position
    
    def add_candidate(self, candidate_data):
        candidate = Candidate(
            name=candidate_data.name,
            position_id=candidate_data.position_id
        )
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate
    
    def get_results(self, election_id):
        election = self.db.query(Election).filter(Election.id == election_id).first()
        if not election:
            raise HTTPException(status_code=404, detail="Election not found")
        
        if election.status != ElectionStatus.CLOSED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Results can only be viewed after election is closed"
            )
        
        results = {}
        positions = self.db.query(Position).filter(
            Position.election_id == election_id
        ).all()
        
        for position in positions:
            candidates = self.db.query(Candidate).filter(
                Candidate.position_id == position.id
            ).all()
            
            candidate_results = []
            for candidate in candidates:
                vote_count = self.db.query(Vote).filter(
                    Vote.candidate_id == candidate.id
                ).count()
                candidate_results.append({
                    "candidate_name": candidate.name,
                    "votes": vote_count
                })
            
            results[position.name] = candidate_results
        
        return results
    