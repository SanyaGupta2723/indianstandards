from datetime import date
from typing import Optional

from pydantic import BaseModel


class AmendmentCreate(BaseModel):
    standard_id: int
    amendment_number: str
    title: Optional[str] = None
    publication_date: Optional[date] = None
    status: Optional[str] = "Active"
    source_url: Optional[str] = None
    description: Optional[str] = None