from fastapi import APIRouter, HTTPException, BackgroundTasks,Query
from typing import List

from src.schemas.note import NoteCreate, NoteResponse, NoteUpdate
from src.services import note_services, gemini_service, redis_service

router = APIRouter()

@router.post("/", response_model=NoteResponse)
async def create_note(note: NoteCreate, background_tasks: BackgroundTasks):
    new_note = await note_services.create_note(note)
    # Queue AI processing in Redis instead of using background tasks
    await redis_service.enqueue_task(
        redis_service.TASK_PROCESS_NOTE, 
        {"note_id": new_note.id}
    )
    # background_tasks.add_task(gemini_service.process_note, new_note.id)

    return new_note

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str):
    note = await note_services.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(note_id: str, note_data: NoteUpdate):
    existing_note = await note_services.get_note(note_id)
    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    updated_note = await note_services.update_note(note_id, note_data)
    return updated_note

@router.delete("/{note_id}")
async def delete_note(note_id: str):
    existing_note = await note_services.get_note(note_id)
    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    await note_services.delete_note(note_id)
    return {"message": "Note deleted successfully"}

@router.get("/", response_model=List[NoteResponse])
async def list_notes():
    return await note_services.list_notes()


@router.get("/search/", response_model=List[NoteResponse])
async def search_notes(q: str = Query(..., description="Search query"), 
                       limit: int = Query(5, description="Maximum number of results")):
    return await note_services.search_notes(q, limit)



@router.post("/{note_id}/process", response_model=NoteResponse)
async def process_note(note_id: str):
    """Manually trigger AI processing for a note"""
    note = await note_services.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    processed_note = await gemini_service.process_note(note_id)
    return processed_note

@router.get("/{note_id}/related", response_model=List[NoteResponse])
async def get_related_notes(note_id: str):
    """Get notes related to this note"""
    note = await note_services.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return await gemini_service.suggest_links(note_id)