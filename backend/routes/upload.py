import os
import tempfile
import pytesseract

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from utils.pdf import extract_text_from_pdf
from utils.ocr import extract_text_from_image

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # File extension check 
    filename = file.filename.lower()
    
    # Temp file me save 
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    
    try:
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(tmp_path)
        elif filename.endswith((".jpg", ".jpeg", ".png")):
            text = extract_text_from_image(tmp_path)
        else:
            return JSONResponse(
                status_code=400,
                content={"error": "Only PDF or image files are allowed!"}
            )
    finally:
        os.unlink(tmp_path)  # Temp file delete karo
    
    return {"text": text, "filename": file.filename}