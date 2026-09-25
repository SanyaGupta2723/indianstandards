from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.standard import Standard


router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)


@router.get("/")
def search_standards(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db)
):
    search_term = f"%{q}%"

    results = (
        db.query(Standard)
        .filter(
            or_(
                Standard.is_number.ilike(search_term),
                Standard.title.ilike(search_term),
                Standard.scope.ilike(search_term),
                Standard.category.ilike(search_term)
            )
        )
        .all()
    )

    return {
        "query": q,
        "count": len(results),
        "results": results
    }
