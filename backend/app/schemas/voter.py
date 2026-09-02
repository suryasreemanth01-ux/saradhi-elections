from pydantic import BaseModel
from typing import List, Optional

class VoterCheckRequest(BaseModel):
    mobile_number: str

class VoterCheckResponse(BaseModel):
    eligible: bool
    voter_name: Optional[str] = None
    election_id: Optional[int] = None
    message: str

class VoteSelection(BaseModel):
    position_id: int
    candidate_id: int

class VoteSubmitRequest(BaseModel):
    mobile_number: str
    election_id: int
    votes: List[VoteSelection]

class VoteSubmitResponse(BaseModel):
    success: bool
    message: str
    ballot_id: Optional[str] = None

class VoterCreate(BaseModel):
    name: str
    mobile_number: str
    house_number: Optional[str] = None

class VoterImportRequest(BaseModel):
    csv_data: str
    