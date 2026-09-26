from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.models.qco import QCO
from app.schemas.qco import QCOCreate


router = APIRouter(
    prefix="/api/qcos",
    tags=["Quality Control Orders"]
)


@router.post("/")
def create_qco(
    qco: QCOCreate,
    db: Session = Depends(get_db)
):
    standard = db.get(Standard, qco.standard_id)

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    new_qco = QCO(**qco.model_dump())

    db.add(new_qco)
    db.commit()
    db.refresh(new_qco)

    return {
        "success": True,
        "id": new_qco.id,
        "message": "QCO mapping created successfully"
    }


@router.get("/standard/{standard_id}")
def get_standard_qcos(
    standard_id: int,
    db: Session = Depends(get_db)
):
    standard = db.get(Standard, standard_id)

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    qcos = (
        db.query(QCO)
        .filter(QCO.standard_id == standard_id)
        .all()
    )

    return {
        "standard_id": standard_id,
        "count": len(qcos),
        "qcos": qcos
    }