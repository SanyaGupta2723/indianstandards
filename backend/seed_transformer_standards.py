from datetime import date

from app.database import SessionLocal
from app.models.standard import Standard


SOURCE_URL = (
    "https://services.bis.gov.in/php/BIS_2.0/"
    "dgdashboard/published/standards"
    "?aspect=&commttid=MjUw&commttname=RVREIDE2&from=&to="
)


TRANSFORMER_STANDARDS = [
    {
        "is_number": "IS 2026 (Part 1):2011",
        "title": "Power Transformers: Part 1 General",
        "scope": (
            "General requirements for three-phase and single-phase "
            "power transformers, including auto-transformers."
        ),
        "standard_type": "Power Transformer Standard",
        "category": "Transformers",
        "edition": "Second Revision",
        "publication_date": date(2011, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 2):2010",
        "title": "Power Transformers: Part 2 Temperature-Rise",
        "scope": (
            "Requirements related to temperature-rise of power transformers."
        ),
        "standard_type": "Power Transformer Standard",
        "category": "Transformers",
        "edition": "First Revision",
        "publication_date": date(2010, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 3):2018",
        "title": (
            "Power Transformers: Part 3 Insulation Levels, "
            "Dielectric Tests and External Clearances in Air"
        ),
        "scope": (
            "Insulation levels, dielectric tests and external clearances "
            "for power transformers."
        ),
        "standard_type": "Testing Standard",
        "category": "Transformers",
        "edition": "Fourth Revision",
        "publication_date": date(2018, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 5):2011",
        "title": "Power Transformers: Part 5 Ability to Withstand Short Circuit",
        "scope": (
            "Requirements for power transformers to withstand the effects "
            "of overcurrents caused by external short circuits."
        ),
        "standard_type": "Testing Standard",
        "category": "Transformers",
        "edition": "First Revision",
        "publication_date": date(2011, 1, 1),
        "status": "Published",
        "source_url": (
            "https://services.bis.gov.in/php/BIS_2.0/"
            "bisconnect/knowyourstandards/Indian_standards/isdetails_mnd/8559"
        ),
    },
    {
        "is_number": "IS 2026 (Part 7):2009",
        "title": "Power Transformers: Part 7 Loading Guide for Oil-Immersed Power Transformers",
        "scope": (
            "Loading guidance for oil-immersed power transformers."
        ),
        "standard_type": "Application Guide",
        "category": "Transformers",
        "edition": "First Revision",
        "publication_date": date(2009, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 8):2009",
        "title": "Power Transformers: Part 8 Application Guide",
        "scope": (
            "Application guidance for power transformers."
        ),
        "standard_type": "Application Guide",
        "category": "Transformers",
        "edition": "Published Standard",
        "publication_date": date(2009, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 10):2025",
        "title": "Power Transformers: Part 10 Determination of Sound Levels",
        "scope": (
            "Methods for determination of sound levels of transformers "
            "and associated cooling devices."
        ),
        "standard_type": "Testing Standard",
        "category": "Transformers",
        "edition": "First Revision",
        "publication_date": date(2025, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 2026 (Part 11):2021",
        "title": "Power Transformers: Part 11 Dry-Type Transformers",
        "scope": (
            "Requirements for dry-type power transformers."
        ),
        "standard_type": "Power Transformer Standard",
        "category": "Transformers",
        "edition": "Published Standard",
        "publication_date": date(2021, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
    {
        "is_number": "IS 1180 (Part 1):2014",
        "title": (
            "Outdoor Type Oil Immersed Distribution Transformers "
            "Up to and Including 2500 kVA, 33 kV — "
            "Part 1 Mineral Oil Immersed"
        ),
        "scope": (
            "Outdoor type oil-immersed distribution transformers "
            "up to and including 2500 kVA and 33 kV."
        ),
        "standard_type": "Product Standard",
        "category": "Distribution Transformers",
        "edition": "Fourth Revision",
        "publication_date": date(2014, 1, 1),
        "status": "Published",
        "source_url": (
            "https://lims.bis.gov.in/home/search_is_number/"
            "?is_number__doc_no=1180"
        ),
    },
    {
        "is_number": "IS 10028 (Part 2):1981",
        "title": (
            "Code of Practice for Selection, Installation and Maintenance "
            "of Transformers: Part 2 Installation"
        ),
        "scope": (
            "Code of practice covering installation of transformers."
        ),
        "standard_type": "Code of Practice",
        "category": "Transformer Installation",
        "edition": "Published Standard",
        "publication_date": date(1981, 1, 1),
        "status": "Published",
        "source_url": SOURCE_URL,
    },
]


def seed_standards():
    db = SessionLocal()

    try:
        added = 0
        skipped = 0

        for data in TRANSFORMER_STANDARDS:
            existing = (
                db.query(Standard)
                .filter(Standard.is_number == data["is_number"])
                .first()
            )

            if existing:
                print(f"SKIPPED: {data['is_number']}")
                skipped += 1
                continue

            standard = Standard(**data)

            db.add(standard)
            added += 1

            print(f"ADDED: {data['is_number']}")

        db.commit()

        print()
        print("===================================")
        print("Transformer standards seed completed")
        print(f"Added   : {added}")
        print(f"Skipped : {skipped}")
        print("===================================")

    except Exception as e:
        db.rollback()
        print("ERROR:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_standards()