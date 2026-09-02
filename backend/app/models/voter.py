from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Voter(Base):
    __tablename__ = "voters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile_number = Column(String, unique=True, index=True, nullable=False)
    house_number = Column(String)
    is_eligible = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    voter_election_status = relationship("VoterElectionStatus", back_populates="voter")

class VoterElectionStatus(Base):
    __tablename__ = "voter_election_status"
    
    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    has_voted = Column(Boolean, default=False)
    voted_at = Column(DateTime(timezone=True), nullable=True)
    
    voter = relationship("Voter", back_populates="voter_election_status")
    election = relationship("Election", back_populates="voter_election_status")
    