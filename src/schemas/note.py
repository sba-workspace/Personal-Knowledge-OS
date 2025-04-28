
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class NoteCreate(BaseModel):
    content: str
    tags: List[str] = []

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None

class NoteResponse(BaseModel):
    id: str
    content: str
    summary: Optional[str] = None
    tags: List[str]
    createdAt: Optional[datetime]= None
    updatedAt: Optional[datetime]= None