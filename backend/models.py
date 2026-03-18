from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EventRequest(BaseModel):
    query: str

class VenueProposal(BaseModel):
    venue_name: str
    location: str
    estimated_cost_usd: float
    capacity: int
    why_it_fits: str
    amenities: List[str]

class EventResponse(BaseModel):
    id: Optional[str] = None
    user_query: str
    venue_name: str
    location: str
    estimated_cost_usd: float
    capacity: int
    why_it_fits: str
    amenities: List[str]
    created_at: Optional[datetime] = None