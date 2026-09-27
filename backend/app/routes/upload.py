import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_text_from_pdf
from app.database import get_db
from app.services.recommendation_service import generate_recommendations
from sqlalchemy.orm import Session
from fastapi import Depends

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


            # ===================================
# PDF + AI RECOMMENDATION
# ===================================

@router.post("/pdf/recommend")
async def upload_pdf_and_recommend(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # -----------------------------------
    # 1. Validate file
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
    # 2. Read file
    # -----------------------------------

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    temp_path = None

    try:

        # -----------------------------------
        # 3. Save temporary PDF
        # -----------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(file_content)
            temp_path = temp_file.name

        # -----------------------------------
        # 4. Extract text
        # -----------------------------------

        extracted_text = extract_text_from_pdf(
            temp_path
        )

        if not extracted_text:
            raise HTTPException(
                status_code=422,
                detail=(
                    "No text could be extracted "
                    "from this PDF."
                )
            )

        # -----------------------------------
        # 5. Generate recommendations
        # -----------------------------------

        result = generate_recommendations(
            text=extracted_text,
            db=db,
            limit=5
        )

        # -----------------------------------
        # 6. Return result
        # -----------------------------------

        return {
            "success": True,
            "filename": file.filename,
            "characters": len(extracted_text),
            "extracted_text": extracted_text,
            "extracted_requirements": (
                result["extracted_requirements"]
            ),
            "search_query": (
                result["search_query"]
            ),
            "recommendations": (
                result["recommendations"]
            )
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"PDF recommendation failed: {str(e)}"
            )
        )

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)