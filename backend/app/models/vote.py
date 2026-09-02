from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Ballot(Base):
    __tablename__ = "ballots"
    
    id = Column(Integer, primary_key=True, index=True)
    ballot_id = Column(String, unique=True, index=True, nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    election = relationship("Election", back_populates="ballots")
    voter = relationship("Voter")
    votes = relationship("Vote", back_populates="ballot")
    
    __table_args__ = (
        UniqueConstraint('election_id', 'voter_id', name='unique_voter_ballot'),
    )

class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    ballot_id = Column(Integer, ForeignKey("ballots.id"), nullable=False)
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    
    ballot = relationship("Ballot", back_populates="votes")
    position = relationship("Position")
    candidate = relationship("Candidate", back_populates="votes")
    
    __table_args__ = (
        UniqueConstraint('ballot_id', 'position_id', name='unique_ballot_position'),
    )
    