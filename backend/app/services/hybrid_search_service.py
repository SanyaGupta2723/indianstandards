from sqlalchemy.orm import Session
from sqlalchemy import select, or_

from app.models.standard import Standard
from app.services.embedding_service import generate_embedding


def hybrid_search(
    query: str,
    db: Session,
    limit: int = 5
):
    # -----------------------------------
    # 1. Generate query embedding
    # -----------------------------------
    query_embedding = generate_embedding(query)

    # -----------------------------------
    # 2. Semantic search
    # -----------------------------------
    semantic_stmt = (
        select(
            Standard,
            Standard.embedding.cosine_distance(query_embedding).label(
                "distance"
            )
        )
        .where(Standard.embedding.is_not(None))
        .order_by(
            Standard.embedding.cosine_distance(query_embedding)
        )
        .limit(20)
    )

    semantic_results = db.execute(semantic_stmt).all()

    # -----------------------------------
    # 3. Keyword search
    # -----------------------------------
    search_term = f"%{query}%"

    keyword_results = (
        db.query(Standard)
        .filter(
            or_(
                Standard.is_number.ilike(search_term),
                Standard.title.ilike(search_term),
                Standard.scope.ilike(search_term),
                Standard.category.ilike(search_term)
            )
        )
        .limit(20)
        .all()
    )

    # -----------------------------------
    # 4. Combine results
    # -----------------------------------
    combined = {}

    # Semantic score
    for standard, distance in semantic_results:

        similarity = max(0, 1 - float(distance))

        combined[standard.id] = {
            "standard": standard,
            "semantic_score": similarity,
            "keyword_score": 0.0
        }

    # Keyword score
    for standard in keyword_results:

        if standard.id not in combined:
            combined[standard.id] = {
                "standard": standard,
                "semantic_score": 0.0,
                "keyword_score": 0.0
            }

        # Basic keyword relevance
        keyword_score = 0.0

        query_lower = query.lower()

        if query_lower in (standard.title or "").lower():
            keyword_score += 1.0

        if query_lower in (standard.scope or "").lower():
            keyword_score += 0.7

        if query_lower in (standard.category or "").lower():
            keyword_score += 0.5

        if query_lower in (standard.is_number or "").lower():
            keyword_score += 1.0

        # Normalize
        keyword_score = min(keyword_score, 1.0)

        combined[standard.id]["keyword_score"] = keyword_score

    # -----------------------------------
    # 5. Final hybrid score
    # -----------------------------------
    results = []

    for item in combined.values():

        standard = item["standard"]

        semantic_score = item["semantic_score"]
        keyword_score = item["keyword_score"]

        # 70% semantic + 30% keyword
        final_score = (
            0.7 * semantic_score +
            0.3 * keyword_score
        )

        results.append({
            "id": standard.id,
            "is_number": standard.is_number,
            "title": standard.title,
            "scope": standard.scope,
            "category": standard.category,
            "edition": standard.edition,
            "status": standard.status,
            "semantic_score": round(semantic_score, 4),
            "keyword_score": round(keyword_score, 4),
            "final_score": round(final_score, 4)
        })

    # -----------------------------------
    # 6. Sort by final score
    # -----------------------------------
    results.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return results[:limit]