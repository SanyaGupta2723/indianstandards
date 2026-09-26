from fastapi import APIRouter

from app.schemas.requirement import RequirementExtractionRequest
from app.services.requirement_extraction_service import extract_requirements


router = APIRouter(
    prefix="/api/requirements",
    tags=["Requirements"]
)


@router.post("/extract")
def extract_requirement_endpoint(
    request: RequirementExtractionRequest
):
    extracted = extract_requirements(request.text)

    return {
        "success": True,
        "input": request.text,
        "data": extracted
    }