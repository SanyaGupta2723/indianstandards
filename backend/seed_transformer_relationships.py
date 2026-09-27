from app.database import SessionLocal
from app.models.standard import Standard
from app.models.standard_relationship import StandardRelationship


RELATIONSHIPS = [
    {
        "source": "IS 2026 (Part 5):2011",
        "target": "IS 2026 (Part 1):2011",
        "relationship_type": "NORMATIVE_REFERENCE",
        "description": (
            "IS 2026 Part 5 identifies IS 2026 Part 1:2011 "
            "as a necessary reference for power transformer requirements."
        ),
    },
    {
        "source": "IS 2026 (Part 5):2011",
        "target": "IS 2026 (Part 2):2010",
        "relationship_type": "NORMATIVE_REFERENCE",
        "description": (
            "IS 2026 Part 5 references Part 2 for temperature-rise "
            "requirements."
        ),
    },
    {
        "source": "IS 2026 (Part 5):2011",
        "target": "IS 2026 (Part 3):2018",
        "relationship_type": "NORMATIVE_REFERENCE",
        "description": (
            "IS 2026 Part 5 references Part 3 for insulation levels "
            "and dielectric tests."
        ),
    },
]


def seed_relationships():

    db = SessionLocal()

    try:

        added = 0
        skipped = 0

        for item in RELATIONSHIPS:

            source_standard = (
                db.query(Standard)
                .filter(
                    Standard.is_number == item["source"]
                )
                .first()
            )

            target_standard = (
                db.query(Standard)
                .filter(
                    Standard.is_number == item["target"]
                )
                .first()
            )

            if not source_standard:

                print(
                    f"SKIPPED: Source not found -> "
                    f"{item['source']}"
                )

                skipped += 1
                continue

            if not target_standard:

                print(
                    f"SKIPPED: Target not found -> "
                    f"{item['target']}"
                )

                skipped += 1
                continue

            existing = (
                db.query(StandardRelationship)
                .filter(
                    StandardRelationship.source_standard_id
                    == source_standard.id,
                    StandardRelationship.target_standard_id
                    == target_standard.id,
                    StandardRelationship.relationship_type
                    == item["relationship_type"],
                )
                .first()
            )

            if existing:

                print(
                    f"SKIPPED: Relationship already exists -> "
                    f"{item['source']} -> {item['target']}"
                )

                skipped += 1
                continue

            relationship = StandardRelationship(
                source_standard_id=source_standard.id,
                target_standard_id=target_standard.id,
                relationship_type=item[
                    "relationship_type"
                ],
                clause=None,
                description=item[
                    "description"
                ],
            )

            db.add(relationship)

            print(
                f"ADDED: "
                f"{item['source']} -> "
                f"{item['target']}"
            )

            added += 1

        db.commit()

        print()
        print("===================================")
        print("Transformer relationships seeded")
        print(f"Added   : {added}")
        print(f"Skipped : {skipped}")
        print("===================================")

    except Exception as e:

        db.rollback()

        print(
            "ERROR:",
            e
        )

    finally:

        db.close()


if __name__ == "__main__":
    seed_relationships()