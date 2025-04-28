from src.core.database import prisma
from src.services import vector_services

async def create_link(source_note_id: str, target_note_id: str):
    """Create a link between two notes"""
    # Check if notes exist
    source = await prisma.note.find_unique(where={"id": source_note_id})
    target = await prisma.note.find_unique(where={"id": target_note_id})
    
    if not source or not target:
        return None
    
    # Check if link already exists to avoid duplicates
    existing_links = await prisma.note.find_unique(
        where={"id": source_note_id},
        include={"links": {"where": {"id": target_note_id}}}
    )
    
    if existing_links and len(existing_links.links) > 0:
        return existing_links  # Link already exists
    
    # Add the link
    return await prisma.note.update(
        where={"id": source_note_id},
        data={"links": {"connect": [{"id": target_note_id}]}},
        include={"links": True}
    )

async def remove_link(source_note_id: str, target_note_id: str):
    """Remove a link between two notes"""
    return await prisma.note.update(
        where={"id": source_note_id},
        data={"links": {"disconnect": [{"id": target_note_id}]}},
        include={"links": True}
    )

async def get_linked_notes(note_id: str):
    """Get all notes linked to this note"""
    note = await prisma.note.find_unique(
        where={"id": note_id},
        include={"links": True, "linkedTo": True}
    )
    
    if not note:
        return []
    
    # Combine both directions of links
    all_links = note.links + note.linkedTo
    return all_links

async def auto_link_notes(note_id: str, similarity_threshold=0.7):
    """Automatically link semantically similar notes"""
    note = await prisma.note.find_unique(where={"id": note_id})
    if not note:
        return []
    
    # Find similar notes
    similar_notes = await vector_services.semantic_search(note.content, limit=10)
    
    links_created = []
    for similar_note in similar_notes:
        # Skip the same note
        if similar_note["id"] == note_id:
            continue
        
        # Create bidirectional links
        await create_link(note_id, similar_note["id"])
        links_created.append(similar_note)
    
    return links_created