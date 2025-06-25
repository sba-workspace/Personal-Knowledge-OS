import asyncio
import logging
from prisma import Prisma
from prisma.errors import PrismaError
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

async def run_migration():
    """Run database migrations"""
    prisma = Prisma()
    
    try:
        # Connect to the database
        await prisma.connect()
        logger.info("Connected to database")
        
        # Create audit log table if it doesn't exist
        await prisma.execute_raw("""
            CREATE TABLE IF NOT EXISTS note_audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                note_id UUID NOT NULL,
                action VARCHAR(50) NOT NULL,
                changes JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                user_id UUID,
                FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
            );
        """)
        
        # Create indexes
        await prisma.execute_raw("""
            CREATE INDEX IF NOT EXISTS note_audit_logs_note_id_idx ON note_audit_logs(note_id);
            CREATE INDEX IF NOT EXISTS note_audit_logs_action_idx ON note_audit_logs(action);
            CREATE INDEX IF NOT EXISTS note_audit_logs_created_at_idx ON note_audit_logs(created_at);
        """)
        
        # Add new columns to notes table
        await prisma.execute_raw("""
            ALTER TABLE notes
            ADD COLUMN IF NOT EXISTS title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
        """)
        
        # Create additional indexes
        await prisma.execute_raw("""
            CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at);
            CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON notes(updated_at);
            CREATE INDEX IF NOT EXISTS notes_is_archived_idx ON notes(is_archived);
            CREATE INDEX IF NOT EXISTS notes_is_pinned_idx ON notes(is_pinned);
        """)
        
        # Create full-text search index
        await prisma.execute_raw("""
            CREATE INDEX IF NOT EXISTS notes_content_summary_title_idx 
            ON notes USING gin(to_tsvector('english', coalesce(content, '') || ' ' || 
                                         coalesce(summary, '') || ' ' || 
                                         coalesce(title, '')));
        """)
        
        logger.info("Migration completed successfully")
        
    except PrismaError as e:
        logger.error(f"Database error during migration: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during migration: {str(e)}")
        raise
    finally:
        await prisma.disconnect()
        logger.info("Disconnected from database")

if __name__ == "__main__":
    asyncio.run(run_migration()) 