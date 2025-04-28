import json
import asyncio
from redis import asyncio as aioredis
from src.core.config import settings
from src.services import gemini_service, vector_services

redis = aioredis.from_url(settings.redis_url)

# Task types
TASK_PROCESS_NOTE = "process_note"
TASK_UPDATE_EMBEDDING = "update_embedding"

async def enqueue_task(task_type: str, payload: dict):
    """Add a task to the Redis queue"""
    task_data = {
        "type": task_type,
        "payload": payload
    }
    await redis.lpush("tasks", json.dumps(task_data))

async def process_tasks():
    """Process tasks from the Redis queue"""
    while True:
        # Block until a task is available, timeout after 1 second
        task = await redis.brpop("tasks", timeout=1)
        
        if task:
            try:
                _, task_data = task
                task_obj = json.loads(task_data)
                
                task_type = task_obj.get("type")
                payload = task_obj.get("payload", {})
                
                if task_type == TASK_PROCESS_NOTE:
                    note_id = payload.get("note_id")
                    if note_id:
                        await gemini_service.process_note(note_id)
                
                elif task_type == TASK_UPDATE_EMBEDDING:
                    note_id = payload.get("note_id")
                    if note_id:
                        await vector_services.update_note_embedding(note_id)
                
            except Exception as e:
                print(f"Error processing task: {e}")
        
        # Small delay to prevent CPU spinning
        await asyncio.sleep(0.1)

async def start_background_worker():
    """Start the background worker to process tasks"""
    asyncio.create_task(process_tasks())