from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.services.hybrid_search_service import hybrid_search

from app.database import get_db
from app.models.standard import Standard


router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

@router.get("/hybrid")
def hybrid_search_endpoint(
    q: str,
    db: Session = Depends(get_db)
):
    results = hybrid_search(
        query=q,
        db=db,
        limit=5
    )

    return {
        "query": q,
        "count": len(results),
        "results": results
    }


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
