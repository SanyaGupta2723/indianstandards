from sqlalchemy.orm import Session

from app.models.certification import Certification
from app.models.qco import QCO
from app.models.standard_version import StandardVersion
from app.models.amendment import Amendment
from app.models.standard_relationship import StandardRelationship

from app.services.requirement_extraction_service import extract_requirements
from app.services.hybrid_search_service import hybrid_search


def calculate_requirement_match(candidate, extracted):
    score = 0.0
    reasons = []

    title = (candidate.get("title") or "").lower()
    scope = (candidate.get("scope") or "").lower()
    category = (candidate.get("category") or "").lower()

    combined_text = f"{title} {scope} {category}"

    # ==================================================
    # 1. PRODUCT MATCH
    # ==================================================

    product = extracted.get("product")

    if product:
        product_lower = product.lower()

        if product_lower in combined_text:
            score += 0.20

            reasons.append(
                f"Product relevance: {product}"
            )

    # ==================================================
    # 2. CATEGORY MATCH
    # ==================================================

    category_req = extracted.get("category")

    if category_req:
        if category_req.lower() in combined_text:
            score += 0.10

            reasons.append(
                f"Category match: {category_req}"
            )

    # ==================================================
    # 3. GENERAL REQUIREMENTS
    # ==================================================

    requirements = extracted.get(
        "requirements",
        []
    )

    if requirements:

        matched_requirements = 0

        for requirement in requirements:

            requirement_lower = requirement.lower()

            # Flexible matching
            if (
                requirement_lower in combined_text
                or (
                    requirement_lower == "testing"
                    and "test" in combined_text
                )
                or (
                    requirement_lower == "installation"
                    and "install" in combined_text
                )
            ):

                matched_requirements += 1

                reasons.append(
                    f"Requirement match: {requirement}"
                )

        if matched_requirements:

            score += 0.15 * (
                matched_requirements
                / len(requirements)
            )

    # ==================================================
    # 4. TECHNICAL PARAMETERS
    # ==================================================

    technical_parameters = extracted.get(
        "technical_parameters",
        []
    )

    if technical_parameters:

        matched_parameters = 0

        for parameter in technical_parameters:

            parameter_clean = parameter.lower()

            if parameter_clean in combined_text:

                matched_parameters += 1

                reasons.append(
                    f"Technical parameter match: {parameter}"
                )

        score += 0.10 * (
            matched_parameters
            / len(technical_parameters)
        )

    # ==================================================
    # 5. TRANSFORMER TYPE
    # ==================================================

    transformer_type = extracted.get(
        "transformer_type"
    )

    if transformer_type:

        transformer_type_lower = transformer_type.lower()

        # ----------------------------------------------
        # Oil immersed
        # ----------------------------------------------

        if transformer_type_lower == "oil-immersed":

            if (
                "oil-immersed" in combined_text
                or "oil immersed" in combined_text
                or "oil-filled" in combined_text
                or "oil filled" in combined_text
                or "liquid-immersed" in combined_text
                or "liquid immersed" in combined_text
            ):

                score += 0.20

                reasons.append(
                    "Transformer type match: oil-immersed"
                )

            # Explicit dry-type mismatch
            elif (
                "dry-type" in combined_text
                or "dry type" in combined_text
            ):

                score -= 0.25

                reasons.append(
                    "Type mismatch: dry-type transformer"
                )

        # ----------------------------------------------
        # Dry type
        # ----------------------------------------------

        elif transformer_type_lower == "dry-type":

            if (
                "dry-type" in combined_text
                or "dry type" in combined_text
            ):

                score += 0.20

                reasons.append(
                    "Transformer type match: dry-type"
                )

            elif (
                "oil-immersed" in combined_text
                or "oil immersed" in combined_text
            ):

                score -= 0.20

                reasons.append(
                    "Type mismatch: oil-immersed transformer"
                )

    # ==================================================
    # 6. VOLTAGE
    # ==================================================

    voltage = extracted.get("voltage")

    if voltage:

        voltage_clean = voltage.lower().replace(
            " ",
            ""
        )

        candidate_clean = combined_text.replace(
            " ",
            ""
        )

        if voltage_clean in candidate_clean:

            score += 0.10

            reasons.append(
                f"Voltage match: {voltage}"
            )

    # ==================================================
    # 7. COOLING
    # ==================================================

    if extracted.get("cooling_required"):

        if "cooling" in combined_text:

            score += 0.07

            reasons.append(
                "Cooling requirement relevance"
            )

    # ==================================================
    # 8. CONTINUOUS OPERATION
    # ==================================================

    if extracted.get("continuous_operation"):

        if (
            "continuous" in combined_text
            or "loading" in combined_text
            or "service" in combined_text
        ):

            score += 0.05

            reasons.append(
                "Continuous operation relevance"
            )

    # ==================================================
    # 9. TESTING
    # ==================================================

    if extracted.get("testing_required"):

        if (
            "test" in title
            or "testing" in title
            or "test" in scope
            or "testing" in scope
        ):

            score += 0.10

            reasons.append(
                "Testing relevance"
            )

    # ==================================================
    # 10. INSTALLATION
    # ==================================================

    if extracted.get("installation_required"):

        if (
            "installation" in combined_text
            or "install" in combined_text
            or "commissioning" in combined_text
        ):

            score += 0.08

            reasons.append(
                "Installation relevance"
            )

    # ==================================================
    # 11. SUBSTATION APPLICATION
    # ==================================================

    application = extracted.get("application")

    if application:

        if application.lower() in combined_text:

            score += 0.05

            reasons.append(
                f"Application relevance: {application}"
            )

    # ==================================================
    # 12. TRANSFORMER CATEGORY
    # ==================================================

    if (
        "transformer" in str(
            extracted.get("product") or ""
        ).lower()
        and "transformer" in combined_text
    ):

        score += 0.05

        reasons.append(
            "Transformer category relevance"
        )

            # ==================================================
    # PRIMARY VS SUPPORTING STANDARD
    # ==================================================

    standard_type = (
        candidate.get("standard_type") or ""
    ).lower()

    standard_title = title.lower()

    # Primary/general/product standards
    if (
        "general" in standard_title
        or "general requirements" in standard_title
        or "product standard" in standard_type
    ):
        score += 0.12

        reasons.append(
            "Primary product standard relevance"
        )

    # Supporting/application standards
    if (
        "application guide" in standard_type
        or "loading guide" in standard_title
        or "code of practice" in standard_type
        or "installation" in standard_title
    ):
        score -= 0.05

        reasons.append(
            "Supporting/application standard"
        )

    # ==================================================
    # 13. SEMANTIC SCORE
    # ==================================================

    semantic_score = candidate.get(
        "semantic_score",
        0.0
    )

    score += 0.15 * semantic_score

    # ==================================================
    # FINAL SCORE
    # ==================================================

    score = max(
        0.0,
        min(score, 1.0)
    )

    return score, reasons


def get_standard_context(
    standard_id: int,
    db: Session
):

    # -------------------------
    # Certification
    # -------------------------

    certifications = (
        db.query(Certification)
        .filter(
            Certification.standard_id == standard_id
        )
        .all()
    )

    certification_data = []

    for cert in certifications:

        certification_data.append({
            "id": cert.id,
            "scheme": cert.scheme,
            "certification_required": cert.certification_required,
            "product_category": cert.product_category,
            "authority": cert.authority,
            "qco_reference": cert.qco_reference,
            "source_url": cert.source_url,
            "notes": cert.notes
        })

    # -------------------------
    # QCO
    # -------------------------

    qcos = (
        db.query(QCO)
        .filter(
            QCO.standard_id == standard_id
        )
        .all()
    )

    qco_data = []

    for qco in qcos:

        qco_data.append({
            "id": qco.id,
            "qco_title": qco.qco_title,
            "notification_number": qco.notification_number,
            "issuing_ministry": qco.issuing_ministry,
            "notification_date": qco.notification_date,
            "effective_date": qco.effective_date,
            "status": qco.status,
            "source_url": qco.source_url,
            "notes": qco.notes
        })

    # -------------------------
    # Versions
    # -------------------------

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

    version_data = []

    for version in versions:

        version_data.append({
            "id": version.id,
            "edition": version.edition,
            "publication_date": version.publication_date,
            "status": version.status,
            "source_url": version.source_url,
            "notes": version.notes
        })

    # -------------------------
    # Amendments
    # -------------------------

    amendments = (
        db.query(Amendment)
        .filter(
            Amendment.standard_id == standard_id
        )
        .order_by(
            Amendment.publication_date.desc()
        )
        .all()
    )

    amendment_data = []

    for amendment in amendments:

        amendment_data.append({
            "id": amendment.id,
            "amendment_number": amendment.amendment_number,
            "title": amendment.title,
            "publication_date": amendment.publication_date,
            "status": amendment.status,
            "source_url": amendment.source_url,
            "description": amendment.description
        })

    # -------------------------
    # Relationships
    # -------------------------

    relationships = (
        db.query(StandardRelationship)
        .filter(
            (StandardRelationship.source_standard_id == standard_id)
            |
            (StandardRelationship.target_standard_id == standard_id)
        )
        .all()
    )

    relationship_data = []

    for relation in relationships:

        if relation.source_standard_id == standard_id:
            related_id = relation.target_standard_id
        else:
            related_id = relation.source_standard_id

        relationship_data.append({
            "id": relation.id,
            "relationship_type": relation.relationship_type,
            "clause": relation.clause,
            "description": relation.description,
            "related_standard_id": related_id
        })

    return {
        "certifications": certification_data,
        "qcos": qco_data,
        "versions": version_data,
        "amendments": amendment_data,
        "relationships": relationship_data
    }


def generate_recommendations(
    text: str,
    db: Session,
    limit: int = 5
):

    # -------------------------
    # 1. Extract requirements
    # -------------------------

    extracted = extract_requirements(text)

    # -------------------------
    # 2. Build search query
    # -------------------------

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
        extracted.get(
            "technical_parameters",
            []
        )
    )

    # -------------------------
    # Transformer-specific search
    # -------------------------

    if extracted.get("transformer_type"):
        search_parts.append(
            extracted["transformer_type"]
        )

    if extracted.get("application"):
        search_parts.append(
            extracted["application"]
        )

    if extracted.get("voltage"):
        search_parts.append(
            extracted["voltage"]
        )

    if extracted.get("cooling_required"):
        search_parts.append(
            "cooling"
        )

    if extracted.get("continuous_operation"):
        search_parts.append(
            "continuous operation"
        )

    # -------------------------
    # Create final search query
    # -------------------------

    search_query = " ".join(
        search_parts
    )

    if not search_query.strip():
        search_query = text

    # -------------------------
    # 3. Hybrid search
    # -------------------------

    candidates = hybrid_search(
        query=search_query,
        db=db,
        limit=20
    )

    # -------------------------
    # 4. Calculate final scores
    # -------------------------

    reranked = []

    for candidate in candidates:

        final_score, reasons = calculate_requirement_match(
            candidate,
            extracted
        )

        # Get additional standard information
        context = get_standard_context(
            candidate["id"],
            db
        )

        reranked.append({

            "id": candidate["id"],

            "is_number": candidate["is_number"],

            "title": candidate["title"],

            "scope": candidate["scope"],

            "category": candidate["category"],

            "edition": candidate["edition"],

            "status": candidate["status"],

            "semantic_score": candidate[
                "semantic_score"
            ],

            "keyword_score": candidate[
                "keyword_score"
            ],

            "match_score": round(
                final_score,
                4
            ),

            "match_reasons": reasons,

            "certifications": context[
                "certifications"
            ],

            "qcos": context[
                "qcos"
            ],

            "versions": context[
                "versions"
            ],

            "amendments": context[
                "amendments"
            ],

            "relationships": context[
                "relationships"
            ]
        })

    # -------------------------
    # 5. Sort by final score
    # -------------------------

    reranked.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    # -------------------------
    # 6. Return top results
    # -------------------------

    recommendations = reranked[:limit]

    return {
        "query": text,

        "extracted_requirements": extracted,

        "search_query": search_query,

        "recommendations": recommendations
    }