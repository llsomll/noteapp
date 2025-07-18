from typing import List
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.user import User # SQLAlchemy user model
from src.db.models.note import Note

from src.schemas.note import NoteCreate, NoteUpdate

class NoteService:
    def __init__(self, db: AsyncSession):
        """
        Initialize the service with a SQLAlchemy AsyncSession.
        """
        self.db = db

    # In Python, any method inside a class must include self as the first parameter.

    async def get_notes_for_user(self, user: User) -> List[Note]:
        """
        Return all notes belonging to the given user.
        """
        stmt = select(Note).where(Note.user_id == user.id)
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_note(self, note_id: UUID, user: User) -> Note:
        """
        Retrieve a specific note by ID, ensuring it belongs to the given user.

        Raises:
            404 if note does not exist,
            403 if user does not own the note.
        """
        note = await self.db.get(Note, note_id)
        if note is None:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.user_id != user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        return note
    
    async def create_note(self, note_data: NoteCreate, user: User) -> Note:
        """
        Create a new note and associate it with the given user.
        """
        # Create the note object from request data and assign the user ID
        note = Note(**note_data.model_dump(), user_id=user.id) # ** dictionary unpacking
        self.db.add(note) # insert note object into the database
        await self.db.commit() # executes the SQL to insert the note into the DB
        await self.db.refresh(note) # updates the note object with any changes from the DB (populates note.id, created_at and updated_at)
        return note
    
    async def update_note(self, note_id: UUID, update_data: NoteUpdate, user: User) -> Note:
        """
        Update an existing note with new data provided by the user.

        Only fields that are explicitly set will be updated.
        """
         # Ensure the note exists and belongs to the user
        note = await self.get_note(note_id, user)
        
        # Apply only the fields that were provided in the update payload
        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(note, field, value) # Dynamically sets the field on the note object
        await self.db.commit() 
        await self.db.refresh(note)
        return note
    
    async def delete_note(self, note_id: UUID, user: User) -> None:
        """
        Delete a note by its ID if it belongs to the given user.
        """
        # Fetch the note and check ownership; raise 404 or 403 if needed
        note = await self.get_note(note_id, user)
        # Mark the note for deletion and commit the change to the database
        await self.db.delete(note)
        await self.db.commit()