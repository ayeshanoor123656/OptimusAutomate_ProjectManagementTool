from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.boards import router as boards_router
from routes.tasks import router as tasks_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Routes
app.include_router(auth_router)

# Board Routes
app.include_router(boards_router)
app.include_router(tasks_router)
@app.get("/")
def home():
    return {
        "message": "TaskFlow Backend Running"
    }