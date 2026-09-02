from pydantic import BaseModel
from typing import List, Optional
from app.models.election import ElectionStatus

class ElectionCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ElectionResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: ElectionStatus

class PositionCreate(BaseModel):
    name: str
    election_id: int
    order: Optional[int] = 0

class CandidateCreate(BaseModel):
    name: str
    position_id: int

class PositionWithCandidates(BaseModel):
    id: int
    name: str
    election_id: int
    order: int
    candidates: List[dict]
    