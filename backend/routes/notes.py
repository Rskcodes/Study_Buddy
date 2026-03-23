from transformers import T5ForConditionalGeneration, T5Tokenizer
from fastapi import APIRouter
from pydantic import BaseModel
import re

router = APIRouter()

model_path = "../models/t5-notes-summarizer"
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)
model.eval()

class NotesRequest(BaseModel):
    text: str

def summarize(text):
    input_text = "summarize: " + text
    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        max_length=512,
        truncation=True
    )
    outputs = model.generate(
        **inputs,
        max_new_tokens=128,
        num_beams=4,
        early_stopping=True
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def summarize_long_notes(text, chunk_size=400):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    
    all_points = []
    seen = set()
    
    for chunk in chunks:
        summary = summarize(chunk)
        sentences = re.split(r'(?<=[.!?]) +', summary.strip())
        for s in sentences:
            s = s.strip()
            if s and s not in seen:
                seen.add(s)
                all_points.append(f"• {s}")
    
    return "\n".join(all_points)

@router.post("/notes")
def summarize_notes(request: NotesRequest):
    result = summarize_long_notes(request.text)
    return {"summary": result}