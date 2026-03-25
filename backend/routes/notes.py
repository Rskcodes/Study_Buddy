import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5Tokenizer
from utils.chunking import summarize_long_text

router = APIRouter()

# Model path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model_path = os.path.join(BASE_DIR, "models", "t5-notes-summarizer")

# Model load 
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)
model.eval()

class NotesRequest(BaseModel):
    text: str

@router.post("/notes")
def summarize_notes(request: NotesRequest):
    result = summarize_long_text(tokenizer, model, request.text)
    return {"summary": result}