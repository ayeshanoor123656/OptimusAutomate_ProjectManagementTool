from pydantic import BaseModel


class Board(BaseModel):
    name: str
    username: str


class JoinBoard(BaseModel):
    invite_code: str
    username: str