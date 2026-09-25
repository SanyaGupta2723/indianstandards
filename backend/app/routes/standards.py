from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.schemas.standard import StandardCreate


router = APIRouter(
    prefix="/api/standards",
    tags=["Standards"]
)


@router.post("/")
def create_standard(
    standard: StandardCreate,
    db: Session = Depends(get_db)
):
    try:
        new_standard = Standard(**standard.model_dump())

        db.add(new_standard)
        db.commit()
        db.refresh(new_standard)

        return {
            "success": True,
            "message": "Standard created successfully",
            "data": {
                "id": new_standard.id,
                "is_number": new_standard.is_number,
                "title": new_standard.title,
                "category": new_standard.category
            }
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


@router.get("/")
def get_standards(
    db: Session = Depends(get_db)
):
    try:
        return db.query(Standard).all()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )