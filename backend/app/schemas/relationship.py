from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.standard import Standard
from app.models.standard_relationship import StandardRelationship
from app.schemas.relationship import RelationshipCreate


router = APIRouter(
    prefix="/api/relationships",
    tags=["Relationships"]
)


@router.post("/")
def create_relationship(
    relationship: RelationshipCreate,
    db: Session = Depends(get_db)
):
    source = db.get(
        Standard,
        relationship.source_standard_id
    )

    target = db.get(
        Standard,
        relationship.target_standard_id
    )

    if not source:
        raise HTTPException(
            status_code=404,
            detail="Source standard not found"
        )

    if not target:
        raise HTTPException(
            status_code=404,
            detail="Target standard not found"
        )

    new_relationship = StandardRelationship(
        **relationship.model_dump()
    )

    db.add(new_relationship)
    db.commit()
    db.refresh(new_relationship)

    return {
        "success": True,
        "id": new_relationship.id,
        "message": "Relationship created successfully"
    }


@router.get("/standard/{standard_id}")
def get_standard_relationships(
    standard_id: int,
    db: Session = Depends(get_db)
):
    standard = db.get(Standard, standard_id)

    if not standard:
        raise HTTPException(
            status_code=404,
            detail="Standard not found"
        )

    relationships = (
        db.query(StandardRelationship)
        .filter(
            (StandardRelationship.source_standard_id == standard_id)
            |
            (StandardRelationship.target_standard_id == standard_id)
        )
        .all()
    )

    results = []

    for relation in relationships:

        if relation.source_standard_id == standard_id:
            related_id = relation.target_standard_id
        else:
            related_id = relation.source_standard_id

        related_standard = db.get(
            Standard,
            related_id
        )

        results.append({
            "id": relation.id,
            "relationship_type": relation.relationship_type,
            "clause": relation.clause,
            "description": relation.description,
            "related_standard": {
                "id": related_standard.id,
                "is_number": related_standard.is_number,
                "title": related_standard.title
            }
        })

    return {
        "standard_id": standard_id,
        "count": len(results),
        "relationships": results
    }