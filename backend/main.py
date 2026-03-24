from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.notes import router as notes_router
from routes.doubt import router as doubt_router
from routes.upload import router as upload_router
from routes.quiz import router as quiz_router
from routes.revision import router as revision_router


app = FastAPI(
    title="Study_Buddy API",
    description="Study assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# routes
app.include_router(notes_router)
app.include_router(doubt_router)
app.include_router(upload_router)
app.include_router(quiz_router)
app.include_router(revision_router)

@app.get("/")
def home():
    return {"message": "StudyBuddy API is running!"}