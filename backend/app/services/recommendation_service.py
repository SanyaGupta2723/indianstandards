from sqlalchemy.orm import Session

from app.services.requirement_extraction_service import extract_requirements
from app.services.hybrid_search_service import hybrid_search


def calculate_requirement_match(
    candidate,
    extracted
):
    """
    Calculate how well a standard matches
    the extracted user requirements.
    """

    score = 0.0
    reasons = []

    title = (candidate.get("title") or "").lower()
    scope = (candidate.get("scope") or "").lower()
    category = (candidate.get("category") or "").lower()

    combined_text = f"{title} {scope} {category}"

    # -----------------------------------
    # Product match
    # -----------------------------------

    product = extracted.get("product")

    if product:
        product_words = product.lower().split()

        matched_words = sum(
            1 for word in product_words
            if len(word) > 2 and word in combined_text
        )

        if matched_words > 0:
            product_score = min(
                matched_words / len(product_words),
                1.0
            )

            score += 0.30 * product_score

            reasons.append(
                f"Product relevance: {product}"
            )

    # -----------------------------------
    # Category match
    # -----------------------------------

    category_req = extracted.get("category")

    if category_req:
        if category_req.lower() in combined_text:
            score += 0.20

            reasons.append(
                f"Category match: {category_req}"
            )

    # -----------------------------------
    # Requirement match
    # -----------------------------------

    requirements = extracted.get(
        "requirements",
        []
    )

    if requirements:

        matched_requirements = 0

        for requirement in requirements:

            if requirement.lower() in combined_text:

                matched_requirements += 1

                reasons.append(
                    f"Requirement match: {requirement}"
                )

        if matched_requirements:

            requirement_score = (
                matched_requirements /
                len(requirements)
            )

            score += 0.25 * requirement_score

    # -----------------------------------
    # Technical parameter relevance
    # -----------------------------------

    technical_parameters = extracted.get(
        "technical_parameters",
        []
    )

    matched_parameters = 0

    for parameter in technical_parameters:

        parameter_clean = parameter.lower()

        if parameter_clean in combined_text:

            matched_parameters += 1

            reasons.append(
                f"Technical parameter mentioned: {parameter}"
            )

    if technical_parameters:

        parameter_score = (
            matched_parameters /
            len(technical_parameters)
        )

        score += 0.10 * parameter_score

    # -----------------------------------
    # Semantic similarity
    # -----------------------------------

    semantic_score = candidate.get(
        "semantic_score",
        0.0
    )

    score += 0.15 * semantic_score

    return min(score, 1.0), reasons


def generate_recommendations(
    text: str,
    db: Session,
    limit: int = 5
):

    # -----------------------------------
    # 1. Extract requirements
    # -----------------------------------

    extracted = extract_requirements(text)

    # -----------------------------------
    # 2. Build search query
    # -----------------------------------

    search_parts = []

    if extracted.get("product"):
        search_parts.append(
            extracted["product"]
        )

    if extracted.get("category"):
        search_parts.append(
            extracted["category"]
        )

    search_parts.extend(
        extracted.get("requirements", [])
    )

    search_parts.extend(
        extracted.get("technical_parameters", [])
    )

    search_query = " ".join(search_parts)

    if not search_query.strip():
        search_query = text

    # -----------------------------------
    # 3. Hybrid search
    # -----------------------------------

    candidates = hybrid_search(
        query=search_query,
        db=db,
        limit=20
    )

    # -----------------------------------
    # 4. Rerank candidates
    # -----------------------------------

    reranked = []

    for candidate in candidates:

        final_score, reasons = calculate_requirement_match(
            candidate,
            extracted
        )

        reranked.append({
            **candidate,
            "rerank_score": round(
                final_score,
                4
            ),
            "match_reasons": reasons
        })

    # -----------------------------------
    # 5. Sort by rerank score
    # -----------------------------------

    reranked.sort(
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    # -----------------------------------
    # 6. Return top results
    # -----------------------------------

    recommendations = reranked[:limit]

    return {
        "query": text,
        "extracted_requirements": extracted,
        "search_query": search_query,
        "recommendations": recommendations
    }