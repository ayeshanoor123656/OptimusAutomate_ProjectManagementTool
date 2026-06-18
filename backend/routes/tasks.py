from fastapi import APIRouter, Body
from bson import ObjectId

from models.task import Task
from database import tasks_collection

router = APIRouter()

@router.post("/tasks")
def create_task(task: Task):

    tasks_collection.insert_one({
        "board_id": task.board_id,
        "title": task.title,
        "status": task.status,
        "due_date": task.due_date
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
            "status": task["status"],
            "due_date": task.get("due_date", "")
        })

    return tasks


@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):

    tasks_collection.delete_one(
        {
            "_id": ObjectId(task_id)
        }
    )

    return {
        "message": "Task Deleted"
    }


@router.put("/tasks/{task_id}")
def update_task_status(
    task_id: str,
    data: dict = Body(...)
):

    tasks_collection.update_one(
        {
            "_id": ObjectId(task_id)
        },
        {
            "$set": {
                "status": data["status"]
            }
        }
    )

    return {
        "message": "Task Updated"
    }