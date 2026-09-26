from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.recommendation_service import (
    generate_recommendations
)


router = APIRouter(
    prefix="/api/recommend",
    tags=["Recommendations"]
)


@router.post("/")
def recommend_standards(
    request: dict,
    db: Session = Depends(get_db)
):

    text = request.get("text", "").strip()

    if not text:
        return {
            "success": False,
            "message": "Requirement text is required"
        }

    result = generate_recommendations(
        text=text,
        db=db,
        limit=5
    )

    return {
        "success": True,
        **result
    }