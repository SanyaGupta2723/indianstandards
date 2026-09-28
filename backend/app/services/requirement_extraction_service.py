"""Requirement extraction with English + Hinglish support.

This is intentionally rule-based for the SIH prototype. It does not translate
or require perfect English grammar. It normalizes common Hinglish phrases into
the canonical product/requirement names already used by the recommendation
engine.
"""

import re
from typing import Any, Dict, List


PRODUCT_PATTERNS = [
    (
        "led street light",
        [
            r"\bled\b.*\b(?:street|road|roadside)\b.*\blights?\b",
            r"\b(?:street|road|roadside)\b.*\bled\b.*\blights?\b",
            r"\bled\s+street\s+lights?\b",
            r"\bled\s+lighting\b",
            r"\bstreet\s+lights?\b",
            r"\bstreet\s+lighting\b",
            r"\broad\s+lights?\b",
            r"\broad\s+lighting\b",
            r"\bled\s+lamp\b",
            r"\bled\s+luminaire\b",
            r"\broad\s+wali\s+led\b",
            r"\bstreet\s+wali\s+led\b",
        ],
    ),
    (
        "transformer",
        [
            r"\btransformers?\b",
            r"\bpower\s+transformers?\b",
            r"\bdistribution\s+transformers?\b",
            r"\btransformer\s+wala\b",
            r"\boil\s+wala\s+transformer\b",
            r"ट्रांसफॉर्मर",
            r"ट्रांसफार्मर",
        ],
    ),
    (
        "cement",
        [
            r"\bcement\b",
            r"\bportland\s+cement\b",
            r"\bpozzolana\s+cement\b",
            r"\bopc\b",
            r"\bppc\b",
            r"सीमेंट",
        ],
    ),
    (
        "steel",
        [
            r"\bstructural\s+steel\b",
            r"\breinforcement\s+steel\b",
            r"\brebar\b",
            r"\bsteel\b",
            r"स्टील",
        ],
    ),
    (
        "water pump",
        [
            r"\bwater\s+pumps?\b",
            r"\bpumps?\b.*\bwater\b",
            r"\bcentrifugal\s+pumps?\b",
            r"\bpump\s+chahiye\b",
            r"\bpump\s+wala\b",
            r"पंप",
        ],
    ),
    (
        "solar panel",
        [
            r"\bsolar\s+panels?\b",
            r"\bphotovoltaic\b",
            r"\bpv\s+modules?\b",
            r"\bsolar\s+modules?\b",
            r"\bsolar\s+plate\b",
            r"सोलर",
        ],
    ),
    (
        "electrical appliance",
        [
            r"\belectrical\s+appliances?\b",
            r"\belectrical\s+equipment\b",
            r"\bappliances?\b",
            r"\belectric\s+equipment\b",
        ],
    ),
]


CATEGORY_MAP = {
    "led street light": "Lighting",
    "transformer": "Transformers",
    "cement": "Cement",
    "steel": "Steel",
    "water pump": "Water Pumps",
    "solar panel": "Solar PV",
    "electrical appliance": "Electrical Appliances",
}


REQUIREMENT_PATTERNS = {
    "Testing": [
        r"\btest(?:ing)?\b",
        r"\btesting\s+(?:bhi\s+)?(?:required|chahiye|honi|hona)\b",
        r"\btest\s+kar(?:na|ni|ne)\b",
        r"\btest\s+bhi\b",
        r"परीक्षण",
        r"जांच",
        r"जाँच",
    ],
    "Installation": [
        r"\binstall(?:ation)?\b",
        r"\binstall\s+kar(?:na|ni|ne)\b",
        r"\binstallation\s+(?:bhi\s+)?(?:required|chahiye|honi|hona)\b",
        r"स्थापना",
        r"इंस्टॉलेशन",
    ],
    "Cooling": [
        r"\bcooling\b",
        r"\bcooling\s+(?:bhi\s+)?(?:required|chahiye|honi|hona)\b",
        r"\bcooling\s+wala\b",
        r"कूलिंग",
        r"शीतलन",
    ],
    "Continuous Operation": [
        r"\bcontinuous\s+operation\b",
        r"\bcontinuous\b.*\boperation\b",
        r"\bcontinuously\b",
        r"\blagatar\s+(?:operation|chal(?:na|e))\b",
        r"\bnonstop\b",
        r"निरंतर\s+संचालन",
    ],
    "Weather Resistance": [
        r"\bweather[-\s]?resistant\b",
        r"\bweatherproof\b",
        r"\boutdoor\b.*\bweather\b",
        r"\bmausam\b.*\bproof\b",
    ],
    "Energy Efficiency": [
        r"\benergy[-\s]?efficient\b",
        r"\benergy\s+saving\b",
        r"\bpower\s+saving\b",
        r"\bkam\s+power\b",
    ],
    "Safety": [
        r"\bsafety\b",
        r"\bsafe\b",
        r"\bsuraksha\b",
        r"सुरक्षा",
    ],
}


APPLICATION_PATTERNS = [
    ("Substation", [r"\bsubstation\b", r"sub\s*station", r"सबस्टेशन"]),
    ("Street Lighting", [
        r"\bstreet\s+lighting\b",
        r"\bstreet\s+lights?\b",
        r"\broad\s+lighting\b",
        r"\broad\s+lights?\b",
        r"\broad\s+ke\s+liye\b",
        r"\bstreet\s+ke\s+liye\b",
        r"\broad\s+wali\s+led\b",
        r"\bstreet\s+wali\s+led\b",
    ]),
    ("Outdoor", [r"\boutdoor\b", r"\bbahar\b", r"\boutside\b"]),
    ("Agricultural", [r"\bagriculture\b", r"\bagricultural\b", r"\bkheti\b"]),
]


def _normalize(text: str) -> str:
    text = (text or "").strip().lower()
    # Keep Devanagari, letters, numbers and slash/hyphen; collapse whitespace.
    text = re.sub(r"[\u200b\ufeff]", "", text)
    text = re.sub(r"[^\w\s./-]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def _contains_any(text: str, patterns: List[str]) -> bool:
    return any(re.search(pattern, text, flags=re.IGNORECASE) for pattern in patterns)


def _first_product(text: str):
    # Hinglish often changes word order: "LED lights ... street ke liye".
    # Treat LED + street/road context as the canonical LED street-light product.
    has_led = _contains_any(text, [
        r"\bled\b",
        r"\bled\s+lights?\b",
        r"\bled\s+lamp\b",
        r"\bled\s+luminaire\b",
    ])
    has_street_context = _contains_any(text, [
        r"\bstreet\b",
        r"\broad\b",
        r"\bstreet\s+ke\s+liye\b",
        r"\broad\s+ke\s+liye\b",
        r"\bstreet\s+wali\b",
        r"\broad\s+wali\b",
    ])
    if has_led and has_street_context:
        return "led street light"

    for product, patterns in PRODUCT_PATTERNS:
        if _contains_any(text, patterns):
            return product
    return None


def _extract_power(text: str):
    # Handles 33kW, 33 kW, 100W, 1.5 MW and common Hinglish wording.
    matches = re.findall(
        r"(?<!\d)(\d+(?:\.\d+)?)\s*(kw|kva|mw|w)\b",
        text,
        flags=re.IGNORECASE,
    )
    return [f"{value} {unit.upper()}" for value, unit in matches]


def _extract_voltage(text: str):
    # Handles 132/33 kV, 33kV and 11 kV.
    matches = re.findall(
        r"(?<!\d)(\d+(?:\.\d+)?(?:\s*/\s*\d+(?:\.\d+)?)?)\s*k?v\b",
        text,
        flags=re.IGNORECASE,
    )
    cleaned = []
    for value in matches:
        value = re.sub(r"\s*/\s*", "/", value)
        cleaned.append(f"{value} kV")
    return cleaned


def extract_requirements(text: str) -> Dict[str, Any]:
    """Extract canonical requirements from English/Hinglish/free-form text."""
    raw_text = text or ""
    normalized = _normalize(raw_text)

    product = _first_product(normalized)
    category = CATEGORY_MAP.get(product) if product else None

    requirements: List[str] = []
    for requirement, patterns in REQUIREMENT_PATTERNS.items():
        if _contains_any(normalized, patterns):
            requirements.append(requirement)

    technical_parameters: List[str] = []
    technical_parameters.extend(_extract_power(normalized))
    technical_parameters.extend(_extract_voltage(normalized))

    transformer_type = None
    if product == "transformer":
        if _contains_any(normalized, [
            r"oil[-\s]?immersed",
            r"oil[-\s]?filled",
            r"oil\s+wala",
            r"oil\s+type",
            r"तेल",
        ]):
            transformer_type = "Oil-Immersed"
        elif _contains_any(normalized, [r"dry[-\s]?type", r"dry\s+transformer"]):
            transformer_type = "Dry-Type"

    application = None
    for name, patterns in APPLICATION_PATTERNS:
        if _contains_any(normalized, patterns):
            application = name
            break

    # For LED/road-light queries, street/road application is highly useful.
    if product == "led street light" and not application:
        if _contains_any(normalized, [r"\bled\b.*\blights?\b"]):
            # Do not assume street use unless the query actually says street/road.
            application = None

    voltage = technical_parameters[-1] if any("kV" in x for x in technical_parameters) else None

    return {
        "product": product,
        "category": category,
        "requirements": requirements,
        "technical_parameters": technical_parameters,
        "transformer_type": transformer_type,
        "voltage": voltage,
        "cooling_required": "Cooling" in requirements,
        "continuous_operation": "Continuous Operation" in requirements,
        "testing_required": "Testing" in requirements,
        "installation_required": "Installation" in requirements,
        "application": application,
        "materials": [],
        "power": _extract_power(normalized),
        "raw_text": raw_text,
    }
