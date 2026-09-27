from app.database import SessionLocal
from app.models.standard import Standard

BIS_COMPENDIUM_URL = "https://www.bis.gov.in/wp-content/uploads/2025/05/COMPENDIUM-OF-CEMENT-STANDARDS.pdf"

CEMENT_STANDARDS = [
    {
        "is_number": "IS 269:2015",
        "title": "Ordinary Portland Cement — Specification (Sixth Revision)",
        "scope": "Ordinary Portland Cement — Specification.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Sixth Revision",
        "publication_date": "2015-01-01",
        "status": "Published",
        "source_url": "https://www.bis.gov.in/is-269-2015/?lang=en",
    },
    {
        "is_number": "IS 455:2015",
        "title": "Portland Slag Cement — Specification (Fifth Revision)",
        "scope": "Portland Slag Cement — Specification.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Fifth Revision",
        "publication_date": "2015-01-01",
        "status": "Published",
        "source_url": BIS_COMPENDIUM_URL,
    },
    {
        "is_number": "IS 1489 (Part 1):2015",
        "title": "Portland Pozzolana Cement — Specification: Part 1 Fly Ash Based (Fourth Revision)",
        "scope": "Portland Pozzolana Cement — Specification: Part 1 Fly Ash Based.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Fourth Revision",
        "publication_date": "2015-01-01",
        "status": "Published",
        "source_url": "https://www.bis.gov.in/is-1489-part-1-2015/?lang=en",
    },
    {
        "is_number": "IS 1489 (Part 2):2015",
        "title": "Portland Pozzolana Cement — Specification: Part 2 Calcined Clay Based (Fourth Revision)",
        "scope": "Portland Pozzolana Cement — Specification: Part 2 Calcined Clay Based.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Fourth Revision",
        "publication_date": "2015-01-01",
        "status": "Published",
        "source_url": BIS_COMPENDIUM_URL,
    },
    {
        "is_number": "IS 3466:1988",
        "title": "Specification for Masonry Cement (Second Revision)",
        "scope": "Masonry Cement — Specification.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Second Revision",
        "publication_date": "1988-01-01",
        "status": "Published",
        "source_url": BIS_COMPENDIUM_URL,
    },
    {
        "is_number": "IS 8041:1990",
        "title": "Rapid Hardening Portland Cement — Specification (Second Revision)",
        "scope": "Rapid Hardening Portland Cement — Specification.",
        "standard_type": "Product Specification",
        "category": "Cement",
        "edition": "Second Revision",
        "publication_date": "1990-01-01",
        "status": "Published",
        "source_url": BIS_COMPENDIUM_URL,
    },
]

def seed():
    db = SessionLocal()
    try:
        inserted = 0
        updated = 0

        for item in CEMENT_STANDARDS:
            existing = (
                db.query(Standard)
                .filter(Standard.is_number == item["is_number"])
                .first()
            )

            if existing:
                for key, value in item.items():
                    if key != "is_number":
                        setattr(existing, key, value)
                updated += 1
            else:
                db.add(Standard(**item))
                inserted += 1

        db.commit()

        print(f"Done. Inserted: {inserted}, Updated: {updated}")
        print("Next step: generate embeddings for these standards.")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
