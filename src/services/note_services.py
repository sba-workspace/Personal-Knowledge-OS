from src.core.database import prisma
from src.schemas.note import NoteCreate, NoteUpdate
from src.services import vector_services
import logging

logger = logging.getLogger(__name__)

async def create_note(data: NoteCreate):
    try:
        note = await prisma.note.create(
            data={
                "content": data.content,
                "tags": data.tags
            }
        )
        
        # Create embedding for the new note
        await vector_services.update_note_embedding(note.id, note.content)
        
        return note
    except Exception as e:
        logger.error(f"Error creating note: {str(e)}")
        raise

async def get_note(note_id: str):
    try:
        return await prisma.note.find_unique(
            where={"id": note_id}
        )
    except Exception as e:
        logger.error(f"Error getting note {note_id}: {str(e)}")
        return None

async def update_note(note_id: str, data: dict | NoteUpdate):
    try:
        # Check if data is a dictionary or a Pydantic model
        if isinstance(data, dict):
            update_data = data
        else:
            # Convert Pydantic model to dictionary
            if hasattr(data, 'model_dump'):
                update_data = data.model_dump(exclude_unset=True)
            else:
                update_data = data.dict(exclude_unset=True)
        
        note = await prisma.note.update(
            where={"id": note_id},
            data=update_data
        )
        
        # If content was updated, update the embedding
        if "content" in update_data:
            await vector_services.update_note_embedding(note_id, note.content)
        
        return note
    except Exception as e:
        logger.error(f"Error updating note {note_id}: {str(e)}")
        raise

async def delete_note(note_id: str):
    try:
        return await prisma.note.delete(
            where={"id": note_id}
        )
    except Exception as e:
        logger.error(f"Error deleting note {note_id}: {str(e)}")
        raise

async def list_notes():
    try:
        return await prisma.note.find_many(
            order_by={"updatedAt": "desc"}
        )
    except Exception as e:
        logger.error(f"Error listing notes: {str(e)}")
        return []

async def search_notes(query: str, limit=5):
    try:
        # Get search results from vector search
        search_results = await vector_services.semantic_search(query, limit)
        
        # Fetch complete note data for each result
        complete_notes = []
        for result in search_results:
            note_id = result["id"]
            complete_note = await get_note(note_id)
            if complete_note:
                complete_notes.append(complete_note)
        
        return complete_notes
    except Exception as e:
        logger.error(f"Error searching notes: {str(e)}")
        return []