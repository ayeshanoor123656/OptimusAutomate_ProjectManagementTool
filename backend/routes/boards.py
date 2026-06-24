from fastapi import APIRouter
from bson import ObjectId
import random
import string

from models.board import Board, JoinBoard
from database import boards_collection

router = APIRouter()


def generate_invite_code():

    return ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=6
        )
    )


@router.post("/boards")
def create_board(board: Board):

    invite_code = generate_invite_code()

    boards_collection.insert_one({
        "name": board.name,
        "invite_code": invite_code,
        "members": []
    })

    return {
        "message": "Board Created",
        "invite_code": invite_code
    }


@router.get("/boards")
def get_boards():

    boards = []

    for board in boards_collection.find():

        boards.append({
            "id": str(board["_id"]),
            "name": board["name"],
            "invite_code": board.get(
                "invite_code",
                ""
            ),
            "members": board.get(
                "members",
                []
            )
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

    boards_collection.delete_one({
        "_id": ObjectId(board_id)
    })

    return {
        "message": "Board Deleted"
    }


@router.post("/boards/join")
def join_board(data: JoinBoard):

    board = boards_collection.find_one({
        "invite_code": data.invite_code
    })

    if not board:

        return {
            "message": "Invalid Invite Code"
        }

    members = board.get(
        "members",
        []
    )

    if data.username not in members:

        members.append(
            data.username
        )

        boards_collection.update_one(
            {
                "_id": board["_id"]
            },
            {
                "$set": {
                    "members": members
                }
            }
        )

    return {
        "message": "Joined Successfully"
    }


@router.get("/boards/user/{username}")
def get_user_boards(username: str):

    boards = []

    for board in boards_collection.find(
        {
            "members": username
        }
    ):

        boards.append({
            "id": str(board["_id"]),
            "name": board["name"],
            "invite_code": board["invite_code"]
        })

    return boards