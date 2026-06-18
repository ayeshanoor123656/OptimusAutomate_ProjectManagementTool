from fastapi import APIRouter
from models.board import Board
from database import boards_collection

router = APIRouter()

@router.post("/boards")
def create_board(board: Board):

    new_board = {
        "name": board.name
    }

    boards_collection.insert_one(new_board)

    return {
        "message": "Board Created"
    }


@router.get("/boards")
def get_boards():

    boards = []

    for board in boards_collection.find():

        boards.append({
            "id": str(board["_id"]),
            "name": board["name"]
        })

    return boards