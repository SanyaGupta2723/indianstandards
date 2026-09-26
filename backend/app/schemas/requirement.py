from pydantic import BaseModel
from typing import List, Optional


class RequirementExtractionRequest(BaseModel):
    text: str


class ExtractedRequirement(BaseModel):
    product: Optional[str] = None
    category: Optional[str] = None
    requirements: List[str] = []
    technical_parameters: List[str] = []