from pydantic import BaseModel
class Task(BaseModel):

    board_id:str
    title:str
    description:str
    assigned_to:str
    status:str
    due_date:str
    priority:str
    estimated_days:int
    comments:list=[]