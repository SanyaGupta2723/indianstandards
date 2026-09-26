from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.models.amendment import Amendment
from app.schemas.amendment import AmendmentCreate


router = APIRouter(
    prefix="/api/amendments",
    tags=["Amendments"]
)


@router.post("/")
def create_amendment(
    amendment: AmendmentCreate,
    db: Session = Depends(get_db)
):
    standard = db.get(
        Standard,
        amendment.standard_id
    )

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    new_amendment = Amendment(
        **amendment.model_dump()
    )

    db.add(new_amendment)
    db.commit()
    db.refresh(new_amendment)

    return {
        "success": True,
        "id": new_amendment.id,
        "message": "Amendment created successfully"
    }


@router.get("/standard/{standard_id}")
def get_amendments(
    standard_id: int,
    db: Session = Depends(get_db)
):
    amendments = (
        db.query(Amendment)
        .filter(
            Amendment.standard_id == standard_id
        )
        .order_by(
            Amendment.publication_date.desc()
        )
        .all()
    )

    return {
        "standard_id": standard_id,
        "count": len(amendments),
        "amendments": amendments
    }