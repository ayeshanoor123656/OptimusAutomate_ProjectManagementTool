from pydantic import BaseModel

class Task(BaseModel):
    board_id: str
    title: str
    status: str
    due_date: str