from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from src.db.database import get_db
from src.db.models.user import User
from src.schemas.note import NoteCreate, NoteUpdate, NoteOut
from src.services.note_service import NoteService
from src.auth.deps import get_current_user

# Creates a **FastAPI router** object.
# `prefix="/note"`: All routes registered here will start with `/note` (e.g., `/note/`, `/note/123`).
# `tags=["notes"]`: Used in API docs (Swagger UI) to group this router's endpoints under a "notes" section.
router = APIRouter(prefix="/note", tags=["notes"])

@router.get("/", response_model=List[NoteOut], operation_id="getNotes")
async def get_notes(
    db: AsyncSession = Depends(get_db),   # Injects an `AsyncSession` from the database dependency
    current_user: User = Depends(get_current_user), # Injects the **currently authenticated user**
):
    return await NoteService(db).get_notes_for_user(current_user)


@router.get("/{note_id}", response_model=NoteOut, operation_id="getNote")
async def get_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),  
    current_user: User = Depends(get_current_user),
):
    return await NoteService(db).get_note(note_id, current_user)


@router.post("/", response_model=NoteOut, status_code=201, operation_id="createNote")
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),  
    current_user: User = Depends(get_current_user),
):
    return await NoteService(db).create_note(note_data, current_user)


@router.put("/{note_id}", response_model=NoteOut, operation_id="updateNote")
async def update_note(
    note_id: UUID,
    note_data: NoteUpdate,
    db: AsyncSession = Depends(get_db),  
    current_user: User = Depends(get_current_user),
):
    return await NoteService(db).update_note(note_id, note_data, current_user)


@router.delete("/{note_id}", status_code=204, operation_id="deleteNote")
async def delete_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),  
    current_user: User = Depends(get_current_user),
):
    await NoteService(db).delete_note(note_id, current_user)