from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, date

router = APIRouter()

class RevisionRequest(BaseModel):
    text: str
    exam_date: str
    student_type: str = "general"
    daily_hours: int = 4

def get_student_tips(student_type):
    tips = {
        "neet": {
            "focus": "MCQ practice, diagrams, NCERT",
            "revision_style": "Read → Practice MCQs → Revise weak areas",
            "extra": "Attempt mock tests every 3 days"
        },
        "jee": {
            "focus": "Problem solving, formulas, concepts",
            "revision_style": "Concept → Solved examples → Practice problems",
            "extra": "Solve previous year papers every week"
        },
        "college": {
            "focus": "Theory, practical, assignments",
            "revision_style": "Read theory → Make notes → Practice questions",
            "extra": "Focus on important topics from exam point of view"
        },
        "placement": {
            "focus": "DSA, CS fundamentals, coding,aptitude",
            "revision_style": "Learn concept → Code it → LeetCode practice",
            "extra": "Solve 2-3 LeetCode problems daily"
        },
        "upsc": {
            "focus": "Current affairs, history, polity, geography",
            "revision_style": "Read → Make notes → Previous year questions",
            "extra": "Read newspaper daily, attempt mock tests weekly"
        },
        "gate": {
            "focus": "Core engineering subjects, aptitude",
            "revision_style": "Concept → Practice problems → Previous papers",
            "extra": "Solve GATE previous year papers topic wise"
        },
        "bank": {
            "focus": "Quantitative aptitude, reasoning, english",
            "revision_style": "Learn shortcuts → Practice → Speed test",
            "extra": "Attempt sectional tests daily"
        },
        "school": {
            "focus": "NCERT concepts, diagrams, formulas",
            "revision_style": "Read NCERT → Practice questions → Revise",
            "extra": "Focus on diagrams and definitions"
        },
        "general": {
            "focus": "Understanding concepts",
            "revision_style": "Read → Summarize → Revise",
            "extra": "Take breaks every 45 minutes"
        }
    }
    return tips.get(student_type, tips["general"])

@router.post("/revision-plan")
def create_revision_plan(request: RevisionRequest):
    exam_date = datetime.strptime(request.exam_date, "%Y-%m-%d").date()
    today = date.today()
    days_left = (exam_date - today).days

    if days_left <= 0:
        return {"error": "Exam date already passed!"}

    sentences = [s.strip() for s in request.text.split('.') if len(s.strip()) > 20]
    total_topics = len(sentences)
    tips = get_student_tips(request.student_type)

    foundation_days = max(1, int(days_left * 0.3))
    deep_study_days = max(1, int(days_left * 0.5))
    revision_days = days_left - foundation_days - deep_study_days

    foundation_topics = sentences[:total_topics // 3]
    deep_topics = sentences[total_topics // 3: 2 * total_topics // 3]
    revision_topics = sentences[2 * total_topics // 3:]

    plan = []
    current_day = 1

    topics_per_day = max(1, len(foundation_topics) // foundation_days)
    for i in range(foundation_days):
        day_topics = foundation_topics[i * topics_per_day:(i + 1) * topics_per_day]
        if not day_topics:
            day_topics = ["Review previous topics"]
        plan.append({
            "day": current_day,
            "phase": "Phase 1 - Foundation",
            "topics": day_topics,
            "daily_goal": f"Study {request.daily_hours} hours",
            "tip": tips["revision_style"]
        })
        current_day += 1

    topics_per_day = max(1, len(deep_topics) // deep_study_days)
    for i in range(deep_study_days):
        day_topics = deep_topics[i * topics_per_day:(i + 1) * topics_per_day]
        if not day_topics:
            day_topics = ["Practice problems"]
        plan.append({
            "day": current_day,
            "phase": "Phase 2 - Deep Study",
            "topics": day_topics,
            "daily_goal": f"Study {request.daily_hours} hours",
            "tip": tips["focus"]
        })
        current_day += 1

    for i in range(revision_days):
        plan.append({
            "day": current_day,
            "phase": "Phase 3 - Revision",
            "topics": ["Full revision of all topics"] if i < revision_days - 1 else ["Final revision - Exam ready!"],
            "daily_goal": f"Study {request.daily_hours} hours",
            "tip": tips["extra"]
        })
        current_day += 1

    return {
        "student_type": request.student_type,
        "exam_date": request.exam_date,
        "days_left": days_left,
        "total_topics": total_topics,
        "revision_plan": plan
    }