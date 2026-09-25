from app.database import SessionLocal
from app.models.standard import Standard
from app.services.embedding_service import generate_embedding


db = SessionLocal()

try:
    standards = db.query(Standard).all()

    for standard in standards:

        text = f"""
        Standard Number: {standard.is_number}
        Title: {standard.title}
        Scope: {standard.scope or ""}
        Category: {standard.category or ""}
        """

        standard.embedding = generate_embedding(text)

        print(f"Embedded: {standard.is_number}")

    db.commit()

    print("All embeddings generated successfully ✅")

except Exception as e:
    db.rollback()
    print("Error:", e)

finally:
    db.close()