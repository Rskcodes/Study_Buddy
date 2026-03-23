from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.notes import router as notes_router

app = FastAPI(
    title="StudyB_uddy API",
    description="AI powered study assistant",
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

@app.get("/")
def home():
    return {"message": "StudyBuddy API is running!"}