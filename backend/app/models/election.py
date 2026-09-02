from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ElectionStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    OPEN = "open"
    CLOSED = "closed"

class Election(Base):
    __tablename__ = "elections"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(Enum(ElectionStatus), default=ElectionStatus.UPCOMING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    positions = relationship("Position", back_populates="election")
    voter_election_status = relationship("VoterElectionStatus", back_populates="election")
    ballots = relationship("Ballot", back_populates="election")

class Position(Base):
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    order = Column(Integer, default=0)
    
    election = relationship("Election", back_populates="positions")
    candidates = relationship("Candidate", back_populates="position")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)
    
    position = relationship("Position", back_populates="candidates")
    votes = relationship("Vote", back_populates="candidate")