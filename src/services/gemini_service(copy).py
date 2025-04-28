import google.generativeai as genai
from src.core.config import settings
from src.services import note_services
import os
# Configure Gemini API
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_summary(text: str) -> str:
    """Generate a summary for the given text using Gemini"""
    prompt = f"Please summarize the following text in a concise paragraph:\n\n{text}"
    response = await model.generate_content_async(prompt)
    return response.text.strip()

async def extract_tags(text: str) -> list:
    """Extract relevant tags from the text using Gemini"""
    prompt = f"Extract 3-5 relevant keywords or tags from this text as a comma-separated list (no explanations):\n\n{text}"
    response = await model.generate_content_async(prompt)
    
    # Process response into a list of tags
    raw_tags = response.text.strip().split(',')
    tags = [tag.strip().lower().replace(' ', '_') for tag in raw_tags if tag.strip()]
    
    return tags[:5]  # Limit to max 5 tags

async def process_note(note_id: str):
    """Process a note with Gemini to generate summary and tags"""
    # Get the note
    note = await note_services.get_note(note_id)
    if not note:
        return None
    
    # Generate summary
    summary = await generate_summary(note.content)
    
    # Extract tags
    tags = await extract_tags(note.content)
    
    # Update the note with summary and tags
    return await note_services.update_note(
        note_id, 
        {"summary": summary, "tags": tags}
    )

async def suggest_links(note_id: str) -> list:
    """Suggest related notes based on content similarity"""
    # Get the note
    note = await note_services.get_note(note_id)
    if not note:
        return []
    
    # Use vector search to find similar notes
    similar_notes = await note_services.search_notes(note.content, limit=5)
    
    # Filter out the current note
    return [n for n in similar_notes if n.id != note_id]