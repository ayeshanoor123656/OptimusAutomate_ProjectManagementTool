from fastapi import APIRouter, Body
from bson import ObjectId

from models.task import Task
from database import tasks_collection

router = APIRouter()


# Create Task
@router.post("/tasks")
def create_task(task: Task):

    tasks_collection.insert_one({

    "board_id":task.board_id,
    "title":task.title,
    "description":task.description,
    "assigned_to":task.assigned_to,
    "status":task.status,
    "due_date":task.due_date,
    "priority":task.priority,
    "estimated_days":task.estimated_days,
    "comments":[]
})

    return {
        "message": "Task Created"
    }


# Get Tasks for a Board
@router.get("/tasks/{board_id}")
def get_tasks(board_id: str):

    tasks = []

    for task in tasks_collection.find(
        {"board_id": board_id}
    ):

        tasks.append({
    "id": str(task["_id"]),
    "title": task["title"],
    "description": task.get("description", ""),
    "assigned_to": task.get("assigned_to", ""),
    "status": task["status"],
    "due_date": task.get("due_date", ""),
    "comments": task.get("comments", [])
})

    return tasks


# Delete Task
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


# Update Task Status (Drag & Drop)
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


# Add Comment
@router.put("/tasks/comment/{task_id}")
def add_comment(
    task_id: str,
    data: dict = Body(...)
):

    tasks_collection.update_one(
        {
            "_id": ObjectId(task_id)
        },
        {
            "$push": {
                "comments": data["comment"]
            }
        }
    )

    return {
        "message": "Comment Added"
    }
@router.get("/mytasks/{username}")
def my_tasks(username: str):

    tasks = []

    for task in tasks_collection.find(
        {
            "assigned_to": username
        }
    ):

        tasks.append({
            "id": str(task["_id"]),
            "title": task["title"],
            "description": task.get("description", ""),
            "assigned_to": task.get("assigned_to", ""),
            "status": task["status"],
            "due_date": task.get("due_date", ""),
            "comments": task.get("comments", [])
        })

    return tasks