from pydantic import BaseModel

class Board(BaseModel):
    name: str


class JoinBoard(BaseModel):
    invite_code: str
    username: str