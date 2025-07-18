from datetime import datetime
from pydantic import Field
from src.db.base import PydanticBase
from typing import Optional
import uuid


class FolderBase(PydanticBase):
    name: str = Field(..., max_length=20)

class FolderOut(FolderBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class FolderCreate(FolderBase):
    pass


class FolderUpdate(PydanticBase):
    name: Optional[str] = Field(None, max_length=20)
