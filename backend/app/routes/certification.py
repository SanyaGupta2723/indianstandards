from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.models.certification import Certification
from app.schemas.certification import CertificationCreate


router = APIRouter(
    prefix="/api/certifications",
    tags=["Certifications"]
)


@router.post("/")
def create_certification(
    certification: CertificationCreate,
    db: Session = Depends(get_db)
):
    standard = db.get(
        Standard,
        certification.standard_id
    )

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    new_certification = Certification(
        **certification.model_dump()
    )

    db.add(new_certification)
    db.commit()
    db.refresh(new_certification)

    return {
        "success": True,
        "id": new_certification.id,
        "message": "Certification mapping created successfully"
    }


@router.get("/standard/{standard_id}")
def get_certification(
    standard_id: int,
    db: Session = Depends(get_db)
):
    standard = db.get(
        Standard,
        standard_id
    )

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    certifications = (
        db.query(Certification)
        .filter(
            Certification.standard_id == standard_id
        )
        .all()
    )

    return {
        "standard_id": standard_id,
        "count": len(certifications),
        "certifications": certifications
    }