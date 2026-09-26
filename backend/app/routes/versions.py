from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.models.standard_version import StandardVersion
from app.schemas.version import VersionCreate


router = APIRouter(
    prefix="/api/versions",
    tags=["Standard Versions"]
)


@router.post("/")
def create_version(
    version: VersionCreate,
    db: Session = Depends(get_db)
):
    standard = db.get(Standard, version.standard_id)

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    new_version = StandardVersion(
        **version.model_dump()
    )

    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    return {
        "success": True,
        "id": new_version.id,
        "message": "Standard version created successfully"
    }


@router.get("/standard/{standard_id}")
def get_versions(
    standard_id: int,
    db: Session = Depends(get_db)
):
    versions = (
        db.query(StandardVersion)
        .filter(
            StandardVersion.standard_id == standard_id
        )
        .order_by(
            StandardVersion.publication_date.desc()
        )
        .all()
    )

    return {
        "standard_id": standard_id,
        "count": len(versions),
        "versions": versions
    }