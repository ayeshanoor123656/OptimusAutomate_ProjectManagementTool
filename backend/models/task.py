from pydantic import BaseModel

class Task(BaseModel):
    board_id: str
    title: str
    description: str
    status: str
    due_date: str
    comments: list = []