from fastapi import APIRouter
from models.task import Task
from database import tasks_collection

router = APIRouter()

@router.post("/tasks")
def create_task(task: Task):

    tasks_collection.insert_one({
        "board_id": task.board_id,
        "title": task.title,
        "status": task.status
    })

    return {
        "message": "Task Created"
    }


@router.get("/tasks/{board_id}")
def get_tasks(board_id: str):

    tasks = []

    for task in tasks_collection.find(
        {"board_id": board_id}
    ):

        tasks.append({
            "id": str(task["_id"]),
            "title": task["title"],
            "status": task["status"]
        })

    return tasks