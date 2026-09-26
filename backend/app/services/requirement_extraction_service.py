import re


def extract_requirements(text: str):
    text_lower = text.lower()

    product = None
    category = None

    requirements = []
    technical_parameters = []

    # --------------------------------------------------
    # Product detection
    # --------------------------------------------------

    if "transformer" in text_lower:
        product = "Transformer"
        category = "Transformers"

    elif "cement" in text_lower:
        product = "Cement"
        category = "Cement"

    elif "steel" in text_lower:
        product = "Steel"
        category = "Steel"

    elif "water pump" in text_lower:
        product = "Water Pump"
        category = "Pumps"

    elif "solar panel" in text_lower:
        product = "Solar Panel"
        category = "Solar Equipment"

    elif "electrical appliance" in text_lower:
        product = "Electrical Appliance"
        category = "Electrical Appliances"

    # --------------------------------------------------
    # General requirement keywords
    # --------------------------------------------------

    requirement_keywords = {
        "safety": "Safety",
        "quality": "Quality",
        "performance": "Performance",
        "testing": "Testing",
        "test": "Testing",
        "durability": "Durability",
        "electrical safety": "Electrical Safety",
        "fire resistance": "Fire Resistance",
        "energy efficiency": "Energy Efficiency",
        "installation": "Installation",
        "commissioning": "Commissioning",
        "maintenance": "Maintenance",
        "cooling": "Cooling",
        "continuous operation": "Continuous Operation",
    }

    for keyword, requirement_name in requirement_keywords.items():

        if keyword in text_lower:
            if requirement_name not in requirements:
                requirements.append(requirement_name)

    # --------------------------------------------------
    # Technical parameters
    # --------------------------------------------------

    # Voltage pair like:
    # 132/33 kV
    # 220/132 kV
    # 33/11 kV

    voltage_pairs = re.findall(
        r"\b\d+(?:\.\d+)?\s*/\s*\d+(?:\.\d+)?\s*kV\b",
        text,
        flags=re.IGNORECASE
    )

    for voltage in voltage_pairs:

        voltage_clean = re.sub(
            r"\s+",
            "",
            voltage
        )

        if voltage_clean not in technical_parameters:
            technical_parameters.append(voltage_clean)

    # --------------------------------------------------
    # Single voltage
    # --------------------------------------------------

    voltages = re.findall(
        r"\b\d+(?:\.\d+)?\s*kV\b",
        text,
        flags=re.IGNORECASE
    )

    for voltage in voltages:

        voltage_clean = re.sub(
            r"\s+",
            "",
            voltage
        )

        if voltage_clean not in technical_parameters:
            technical_parameters.append(voltage_clean)

    # --------------------------------------------------
    # Frequency
    # --------------------------------------------------

    frequencies = re.findall(
        r"\b\d+(?:\.\d+)?\s*Hz\b",
        text,
        flags=re.IGNORECASE
    )

    for frequency in frequencies:

        frequency_clean = re.sub(
            r"\s+",
            "",
            frequency
        )

        if frequency_clean not in technical_parameters:
            technical_parameters.append(frequency_clean)

    # --------------------------------------------------
    # Transformer-specific attributes
    # --------------------------------------------------

    transformer_type = None

    if (
        "oil-immersed" in text_lower
        or "oil immersed" in text_lower
        or "oil-filled" in text_lower
        or "oil filled" in text_lower
    ):
        transformer_type = "Oil-Immersed"

    elif (
        "dry-type" in text_lower
        or "dry type" in text_lower
    ):
        transformer_type = "Dry-Type"

    # --------------------------------------------------
    # Cooling arrangement
    # --------------------------------------------------

    cooling_required = False

    if "cooling" in text_lower:
        cooling_required = True

    # --------------------------------------------------
    # Continuous operation
    # --------------------------------------------------

    continuous_operation = False

    if (
        "continuous operation" in text_lower
        or "continuous duty" in text_lower
        or "continuous service" in text_lower
    ):
        continuous_operation = True

    # --------------------------------------------------
    # Testing
    # --------------------------------------------------

    testing_required = False

    if (
        "testing" in text_lower
        or "test" in text_lower
        or "testing requirements" in text_lower
    ):
        testing_required = True

    # --------------------------------------------------
    # Installation
    # --------------------------------------------------

    installation_required = False

    if (
        "installation" in text_lower
        or "install" in text_lower
    ):
        installation_required = True

    # --------------------------------------------------
    # Substation
    # --------------------------------------------------

    application = None

    if "substation" in text_lower:
        application = "Substation"

    # --------------------------------------------------
    # Material
    # --------------------------------------------------

    materials = []

    material_keywords = [
        "steel",
        "stainless steel",
        "aluminium",
        "aluminum",
        "copper",
        "cast iron",
        "plastic",
        "concrete",
        "mineral oil",
    ]

    for material in material_keywords:

        if material in text_lower:
            materials.append(material)

    # --------------------------------------------------
    # Return structured requirement
    # --------------------------------------------------

    return {
        "product": product,
        "category": category,

        "requirements": requirements,

        "technical_parameters": technical_parameters,

        "transformer_type": transformer_type,

        "voltage": voltage_pairs[0]
        if voltage_pairs
        else None,

        "cooling_required": cooling_required,

        "continuous_operation": continuous_operation,

        "testing_required": testing_required,

        "installation_required": installation_required,

        "application": application,

        "materials": materials,
    }