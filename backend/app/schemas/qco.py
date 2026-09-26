from datetime import date
from typing import Optional

from pydantic import BaseModel


class QCOCreate(BaseModel):
    standard_id: int
    qco_title: str

    notification_number: Optional[str] = None
    issuing_ministry: Optional[str] = None

    notification_date: Optional[date] = None
    effective_date: Optional[date] = None

    status: str = "Unverified"

    source_url: Optional[str] = None
    notes: Optional[str] = None