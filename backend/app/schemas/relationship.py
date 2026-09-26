from typing import Optional

from pydantic import BaseModel


class RelationshipCreate(BaseModel):
    source_standard_id: int
    target_standard_id: int
    relationship_type: str
    clause: Optional[str] = None
    description: Optional[str] = None