from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from database import tasks_collection
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
class SubtaskPrompt(BaseModel):
    title: str


@router.post("/ai/generate-subtasks")
def generate_subtasks(data: SubtaskPrompt):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """
Generate exactly 5 software development subtasks.

Return ONLY valid JSON.

Format:

[
 {
   "title":"",
   "description":"",
   "priority":"",
   "estimated_days":0
 }
]

Priority must be one of:
Low
Medium
High
Critical

Do not include markdown.
Do not include explanations.
Return only JSON.
"""
            },
            {
                "role": "user",
                "content": data.title
            }
        ]
    )

    import json

    subtasks = json.loads(
        response.choices[0].message.content
    )

    return {
        "subtasks": subtasks
    }
@router.get("/ai/project-summary/{board_id}")
def project_summary(board_id: str):

    tasks = list(
        tasks_collection.find(
            {
                "board_id": board_id
            }
        )
    )

    if len(tasks) == 0:
        return {
            "summary": "No tasks available."
        }

    task_text = ""

    for task in tasks:

        task_text += f"""
Title: {task['title']}
Status: {task['status']}
Priority: {task.get('priority','Medium')}
Description: {task.get('description','')}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role":"system",
                "content":"""
You are an AI Project Manager.

Analyze these tasks.

Return:

Project Progress

Main Risks

Recommendations

Upcoming Focus

Keep it under 150 words.
"""
            },
            {
                "role":"user",
                "content":task_text
            }
        ]
    )

    return {
        "summary":
        response.choices[0].message.content
    }