from sentence_transformers import SentenceTransformer
from src.core.database import prisma

# Initialize the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

async def create_embedding(text: str):
    """Create a vector embedding for the given text"""
    return model.encode(text).tolist()

async def update_note_embedding(note_id: str, text: str = None):
    """Update the embedding for a note"""
    if text is None:
        note = await prisma.note.find_unique(where={"id": note_id})
        if not note:
            return None
        text = note.content
    
    embedding = await create_embedding(text)
    
    # turn embedding into the '[0.1,0.2,…]' literal Postgres expects
    vector_literal = f"[{','.join(str(x) for x in embedding)}]"
    
    
    # return await prisma.note.update(
    #     where={"id": note_id},
    #     data={"embedding": embedding}
    # )
    
    await prisma.execute_raw(
        '''
        UPDATE "Note"
        SET embedding = $1::vector
        WHERE id = $2
        ''',
        vector_literal,
        note_id,
    )

    return True


async def semantic_search(query: str, limit=5):
    """Find notes semantically similar to the query"""
    
    # Get embedding for query
    query_embedding = await create_embedding(query)
    
    # Make sure query_embedding is a list of numbers
    if not query_embedding or not isinstance(query_embedding, list):
        return []
    
    # Convert the list to a string format PostgreSQL can use for vector type
    vector_str = f"[{','.join(str(x) for x in query_embedding)}]"
    
    # Raw SQL for vector search since Prisma doesn't directly support vector operations
    results = await prisma.query_raw(
        """
        SELECT n.id, n.content, n.summary, n.tags,
               n.embedding <-> $1::vector as distance
        FROM "Note" n
        ORDER BY distance
        LIMIT $2
        """,
        vector_str,
        limit
    )
    
    return results