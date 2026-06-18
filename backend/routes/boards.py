from fastapi import APIRouter
from bson import ObjectId

from models.board import Board
from database import boards_collection

router = APIRouter()

@router.post("/boards")
def create_board(board: Board):

    boards_collection.insert_one({
        "name": board.name
    })

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


@router.get("/boards/count")
def board_count():

    count = boards_collection.count_documents({})

    return {
        "total_boards": count
    }


@router.delete("/boards/{board_id}")
def delete_board(board_id: str):

    boards_collection.delete_one(
        {
            "_id": ObjectId(board_id)
        }
    )

    return {
        "message": "Board Deleted"
    }