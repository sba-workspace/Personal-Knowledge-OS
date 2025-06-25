from src.core.database import prisma
import logging
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

async def log_note_change(
    note_id: str,
    action: str,
    changes: Optional[Dict[str, Any]] = None,
    user_id: Optional[str] = None
) -> None:
    """Log a change to a note in the audit log"""
    try:
        await prisma.noteauditlog.create(
            data={
                "noteId": note_id,
                "action": action,
                "changes": changes or {},
                "userId": user_id,
                "createdAt": datetime.utcnow()
            }
        )
        logger.info(f"Logged {action} action for note {note_id}")
    except Exception as e:
        logger.error(f"Error logging note change: {str(e)}")
        # Don't raise the error as audit logging should not block the main operation

async def get_note_history(note_id: str, limit: int = 10) -> list:
    """Get the audit history for a note"""
    try:
        return await prisma.noteauditlog.find_many(
            where={"noteId": note_id},
            order_by={"createdAt": "desc"},
            take=limit
        )
    except Exception as e:
        logger.error(f"Error getting note history: {str(e)}")
        return []

async def get_recent_changes(limit: int = 20) -> list:
    """Get recent changes across all notes"""
    try:
        return await prisma.noteauditlog.find_many(
            order_by={"createdAt": "desc"},
            take=limit,
            include={"note": True}
        )
    except Exception as e:
        logger.error(f"Error getting recent changes: {str(e)}")
        return [] 