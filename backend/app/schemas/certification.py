from typing import Optional

from pydantic import BaseModel


class CertificationCreate(BaseModel):
    standard_id: int
    scheme: Optional[str] = None
    certification_required: bool = False
    product_category: Optional[str] = None
    authority: Optional[str] = None
    qco_reference: Optional[str] = None
    source_url: Optional[str] = None
    notes: Optional[str] = None