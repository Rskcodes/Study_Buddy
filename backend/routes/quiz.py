import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5Tokenizer

router = APIRouter()

# Model path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model_path = os.path.join(BASE_DIR, "models", "Valhalla-quiz-generator")

# Model load
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)
model.eval()


class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5


def generate_questions(text, num_questions=5):
    """Generate quiz questions from input text using highlight-based QG."""
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.strip()) > 10]

    if not sentences:
        sentences = [text]

    questions = []
    seen = set()

    for sentence in sentences:
        if len(questions) >= num_questions:
            break

        # Use the T5 QG format: "generate question: <hl> answer <hl> context"
        input_text = f"generate question: {sentence}"
        inputs = tokenizer(
            input_text,
            return_tensors="pt",
            max_length=512,
            truncation=True
        )

        outputs = model.generate(
            **inputs,
            max_new_tokens=64,
            num_beams=4,
            early_stopping=True
        )

        question = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

        if question and question not in seen:
            seen.add(question)
            questions.append({
                "question": question,
                "context": sentence
            })

    return questions


@router.post("/quiz")
def generate_quiz(request: QuizRequest):
    questions = generate_questions(request.text, request.num_questions)
    return {
        "num_questions": len(questions),
        "questions": questions
    }