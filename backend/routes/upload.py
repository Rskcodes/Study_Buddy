import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import tempfile

router = APIRouter()

def extract_text_from_pdf(file_path):
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    return text.strip()

def extract_text_from_image(file_path):
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image)
    return text.strip()

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
                content={"error": "Sirf PDF ya image upload karo!"}
            )
    finally:
        os.unlink(tmp_path)  # Temp file delete karo
    
    return {"text": text, "filename": file.filename}