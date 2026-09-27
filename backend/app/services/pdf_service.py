import fitz


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF using PyMuPDF.
    """

    document = fitz.open(file_path)

    pages = []

    try:
        for page in document:
            text = page.get_text("text")

            if text:
                pages.append(text)

    finally:
        document.close()

    return "\n".join(pages).strip()