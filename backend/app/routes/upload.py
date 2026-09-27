import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_text_from_pdf


router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):

    # -----------------------------------
    # 1. Check file type
    # -----------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    # -----------------------------------
    # 2. Read uploaded file
    # -----------------------------------

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    # -----------------------------------
    # 3. Temporary file
    # -----------------------------------

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(file_content)
            temp_path = temp_file.name

        # -----------------------------------
        # 4. Extract PDF text
        # -----------------------------------

        extracted_text = extract_text_from_pdf(
            temp_path
        )

        # -----------------------------------
        # 5. Check extraction
        # -----------------------------------

        if not extracted_text:

            raise HTTPException(
                status_code=422,
                detail=(
                    "No text could be extracted "
                    "from this PDF. It may be a scanned PDF."
                )
            )

        # -----------------------------------
        # 6. Return result
        # -----------------------------------

        return {
            "success": True,
            "filename": file.filename,
            "characters": len(extracted_text),
            "text": extracted_text
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)