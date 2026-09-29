from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from faster_whisper import WhisperModel
import tempfile
import os

router = APIRouter(prefix="/api/voice", tags=["voice"])

# Small CPU-friendly model for the prototype.
# First request downloads the model automatically.
model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
)

@router.post("/transcribe")
async def transcribe_voice(
    file: UploadFile = File(...),
    language: str = Form("en"),
):
    suffix = os.path.splitext(file.filename or "")[1] or ".webm"
    temp_path = None

    try:
        audio_bytes = await file.read()

        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file.")

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp:
            temp.write(audio_bytes)
            temp_path = temp.name

        detected_language = language if language in {"en", "hi"} else None

        segments, info = model.transcribe(
            temp_path,
            language=detected_language,
            beam_size=5,
            vad_filter=True,
        )

        text = " ".join(
            segment.text.strip()
            for segment in segments
            if segment.text.strip()
        ).strip()

        return {
            "text": text,
            "language": info.language,
            "duration": info.duration,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Voice transcription failed: {exc}",
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
