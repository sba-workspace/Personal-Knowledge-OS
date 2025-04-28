from fastapi import APIRouter, HTTPException
from typing import List

from src.schemas.note import NoteResponse
from src.services import note_services, linking_service

router = APIRouter()

@router.post("/{source_id}/link/{target_id}")
async def create_link(source_id: str, target_id: str):
    """Create a link between two notes"""
    # Check if notes exist
    source = await note_services.get_note(source_id)
    target = await note_services.get_note(target_id)
    
    if not source:
        raise HTTPException(status_code=404, detail="Source note not found")
    if not target:
        raise HTTPException(status_code=404, detail="Target note not found")
    
    result = await linking_service.create_link(source_id, target_id)
    return {"message": "Link created successfully"}

@router.delete("/{source_id}/link/{target_id}")
async def remove_link(source_id: str, target_id: str):
    """Remove a link between two notes"""
    # Check if notes exist
    source = await note_services.get_note(source_id)
    
    if not source:
        raise HTTPException(status_code=404, detail="Source note not found")
    
    result = await linking_service.remove_link(source_id, target_id)
    return {"message": "Link removed successfully"}

@router.get("/{note_id}/links", response_model=List[NoteResponse])
async def get_linked_notes(note_id: str):
    """Get all notes linked to this note"""
    note = await note_services.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    linked_notes = await linking_service.get_linked_notes(note_id)
    return linked_notes

@router.post("/{note_id}/auto-link", response_model=List[NoteResponse])
async def auto_link_notes(note_id: str):
    """Automatically link similar notes"""
    note = await note_services.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    linked_notes = await linking_service.auto_link_notes(note_id)
    return linked_notes