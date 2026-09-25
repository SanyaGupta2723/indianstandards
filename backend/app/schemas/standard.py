from datetime import date
from typing import Optional

from pydantic import BaseModel


class StandardCreate(BaseModel):
    is_number: str
    title: str
    scope: Optional[str] = None
    standard_type: Optional[str] = None
    category: Optional[str] = None
    edition: Optional[str] = None
    publication_date: Optional[date] = None
    status: Optional[str] = "Active"
    source_url: Optional[str] = None


class StandardResponse(StandardCreate):
    id: int

    class Config:
        from_attributes = True