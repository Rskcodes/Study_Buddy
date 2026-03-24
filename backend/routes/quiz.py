from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5

@router.post("/quiz")
def generate_quiz(request: QuizRequest):
    return {"message": "Coming soon... Model training in progress!"}