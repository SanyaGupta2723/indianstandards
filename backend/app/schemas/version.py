from datetime import date
from typing import Optional

from pydantic import BaseModel


class VersionCreate(BaseModel):
    standard_id: int
    edition: str
    publication_date: Optional[date] = None
    status: Optional[str] = "Active"
    source_url: Optional[str] = None
    notes: Optional[str] = None