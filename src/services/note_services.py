from src.core.database import prisma
from src.schemas.note import NoteCreate, NoteUpdate
from src.services import vector_services

async def create_note(data: NoteCreate):
    return await prisma.note.create(
        data={
            "content": data.content,
            "tags": data.tags
        }
    )

async def get_note(note_id: str):
    return await prisma.note.find_unique(
        where={"id": note_id}
    )

async def update_note(note_id: str, data: dict | NoteUpdate):
    # Check if data is a dictionary or a Pydantic model
    if isinstance(data, dict):
        # If it's a dictionary, use it directly
        update_data = data
    else:
        # If it's a Pydantic model, convert to dictionary
        # Try model_dump first (Pydantic v2), fall back to dict() (Pydantic v1)
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
    
    # If content was updated, update the embedding
    if "content" in update_data:
        await vector_services.update_note_embedding(note_id, note.content)
    
    return note

async def delete_note(note_id: str):
    return await prisma.note.delete(
        where={"id": note_id}
    )

async def list_notes():
    return await prisma.note.find_many()


async def list_notes():
    return await prisma.note.find_many()

async def search_notes(query: str, limit=5):
    # Get search results (likely just IDs or incomplete note objects)
    search_results = await vector_services.semantic_search(query, limit)
    
    # Fetch complete note data for each result
    complete_notes = []
    for result in search_results:
        # Assuming result has an id field
        note_id = result["id"]
        # Fetch complete note with all fields
        complete_note = await get_note(note_id)
        if complete_note:
            complete_notes.append(complete_note)
    
    return complete_notes