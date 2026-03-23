
import os
import torch
from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, RobertaForQuestionAnswering

router = APIRouter()

# Model path

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model_path = os.path.join(BASE_DIR, "models", "roberta-doubt-solver")

# Model load 
tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=True)
model = RobertaForQuestionAnswering.from_pretrained(model_path)
model.eval()

class DoubtRequest(BaseModel):
    question: str
    context: str

@router.post("/doubt")
def solve_doubt(request: DoubtRequest):
    inputs = tokenizer(
        request.question,
        request.context,
        return_tensors="pt",
        max_length=512,
        truncation=True
    )
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    start = torch.argmax(outputs.start_logits)
    end = torch.argmax(outputs.end_logits) + 1
    
    answer = tokenizer.decode(
        inputs["input_ids"][0][start:end],
        skip_special_tokens=True
    )
    
    return {"answer": answer}