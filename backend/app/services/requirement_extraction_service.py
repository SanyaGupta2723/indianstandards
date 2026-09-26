import re


def extract_requirements(text: str):

    text_lower = text.lower()

    product = None
    category = None

    requirements = []
    technical_parameters = []

    # -----------------------------
    # Product detection
    # -----------------------------

    product_patterns = [
        (
            r"household electrical appliances?",
            "Household electrical appliance",
            "Electrical Appliances"
        ),
        (
            r"electrical appliances?",
            "Electrical appliance",
            "Electrical Appliances"
        ),
        (
            r"transformers?",
            "Transformer",
            "Electrical Equipment"
        ),
        (
            r"cement",
            "Cement",
            "Construction Materials"
        ),
        (
            r"steel",
            "Steel",
            "Metal Products"
        )
    ]

    for pattern, detected_product, detected_category in product_patterns:
        if re.search(pattern, text_lower):
            product = detected_product
            category = detected_category
            break

    # -----------------------------
    # Requirement detection
    # -----------------------------

    requirement_keywords = {
        "safety": "Safety",
        "quality": "Quality requirements",
        "performance": "Performance requirements",
        "testing": "Testing requirements",
        "durability": "Durability",
        "electrical safety": "Electrical safety",
        "fire resistance": "Fire resistance",
        "energy efficiency": "Energy efficiency"
    }

    for keyword, requirement in requirement_keywords.items():
        if keyword in text_lower:
            requirements.append(requirement)

    # -----------------------------
    # Voltage detection
    # -----------------------------

    voltage_matches = re.findall(
        r"\b\d+(?:\.\d+)?\s*(?:v|volt|volts)\b",
        text_lower
    )

    for voltage in voltage_matches:
        technical_parameters.append(voltage)

    # -----------------------------
    # Frequency detection
    # -----------------------------

    frequency_matches = re.findall(
        r"\b\d+(?:\.\d+)?\s*(?:hz|hertz)\b",
        text_lower
    )

    for frequency in frequency_matches:
        technical_parameters.append(frequency)

    # -----------------------------
    # Material detection
    # -----------------------------

    materials = [
        "plastic",
        "steel",
        "aluminium",
        "aluminum",
        "copper",
        "stainless steel"
    ]

    for material in materials:
        if material in text_lower:
            technical_parameters.append(
                f"Material: {material}"
            )

    return {
        "product": product,
        "category": category,
        "requirements": requirements,
        "technical_parameters": technical_parameters
    }