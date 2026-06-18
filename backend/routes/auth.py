from fastapi import APIRouter
from models.user import UserRegister, UserLogin
from database import users_collection
from utils.auth import hash_password, verify_password

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {"message": "Email already exists"}

    hashed = hash_password(user.password)

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed
    })

    return {"message": "User Registered Successfully"}


@router.post("/login")
def login(user: UserLogin):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return {"message": "User not found"}

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        return {"message": "Invalid Password"}

    return {
        "message": "Login Successful",
        "name": existing_user["name"]
    }