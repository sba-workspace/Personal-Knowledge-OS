from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from src.core.config import settings
from src.services import note_services,vector_services
from src.core.database import prisma
from src.schemas.note import NoteUpdate  # Add this import line


# Initialize the Gemini model via LangChain
model = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=settings.gemini_api_key
)

# Output parser
output_parser = StrOutputParser()

async def generate_summary(text: str) -> str:
    """Generate a summary for the given text using Gemini through LangChain."""
    prompt = ChatPromptTemplate.from_template(
        "Please summarize the following text in a concise paragraph:\n\n{text}"
    )
    chain = prompt | model | output_parser
    try:
        summary = await chain.ainvoke({"text": text})
        return summary.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Summary generation failed."

async def extract_tags(text: str) -> list[str]:
    """Extract relevant tags from the text using Gemini through LangChain."""
    prompt = ChatPromptTemplate.from_template(
        "Extract 3-5 relevant keywords or tags from this text as a comma-separated list (no explanations):\n\n{text}"
    )
    chain = prompt | model | output_parser
    try:
        raw_tags = await chain.ainvoke({"text": text})
        tags = [tag.strip().lower().replace(' ', '_') for tag in raw_tags.split(',') if tag.strip()]
        return tags[:5]
    except Exception as e:
        print(f"Error extracting tags: {e}")
        return []

async def process_note(note_id: str):
    """Process a note with Gemini to generate summary and tags."""
    note = await note_services.get_note(note_id)
    if not note:
        return None

    summary = await generate_summary(note.content)
    tags = await extract_tags(note.content)

    return await note_services.update_note(
        note_id,
        {"summary": summary, "tags": tags}
    )

async def suggest_links(note_id: str) -> list:
    """Suggest related notes based on content similarity."""
    note = await note_services.get_note(note_id)
    if not note:
        return []

    similar_notes = await note_services.search_notes(note.content, limit=5)

    return [n for n in similar_notes if n.id != note_id]
