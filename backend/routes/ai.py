from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

class TaskPrompt(BaseModel):
    title: str

@router.post("/ai/generate-description")
def generate_description(data: TaskPrompt):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Generate a professional task description in 2-3 sentences."
            },
            {
                "role": "user",
                "content": data.title
            }
        ]
    )

    return {
        "description": response.choices[0].message.content
    }