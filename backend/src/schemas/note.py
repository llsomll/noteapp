from datetime import datetime
from typing import Optional
import uuid

from pydantic import Field
from src.db.base import PydanticBase

class NoteBase(PydanticBase):
    title: str = Field(..., max_length=50)
    content: Optional[str] = None
    folder_id: Optional[uuid.UUID] = None
    is_starred: bool = False


class NoteOut(NoteBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class NoteCreate(NoteBase):
    pass


class NoteUpdate(PydanticBase):
    title: Optional[str] = Field(None, max_length=50)
    content: Optional[str] = None
    folder_id: Optional[uuid.UUID] = None
    is_starred: Optional[bool] = None