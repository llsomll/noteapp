from typing import List
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.models.user import User 
from src.db.models.note import Note
from src.db.models.folder import Folder

from src.schemas.folder import FolderCreate, FolderUpdate

class FolderService:
    def __init__(self, db: AsyncSession):
        """
        Initialize the service with a SQLAlchemy AsyncSession.
        """
        self.db = db

    async def get_folders_for_user(self, user: User) -> List[Folder]:
        """
        Return all folders belonging to the given user.
        """
        stmt = select(Folder).where(Folder.user_id == user.id)
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_folder(self, folder_id: UUID, user: User) -> Folder:
        """
        Retrieve a specific folder by ID, ensuring it belongs to the user.
        Raises 404 if not found, or 403 if access is denied.
        """
        folder = await self.db.get(Folder, folder_id)
        if folder is None:
            raise HTTPException(status_code=404, detail="Folder not found")
        if folder.user_id != user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        return folder
    
    async def create_folder(self, folder_data: FolderCreate, user: User) -> Folder:
        """
        Create a new folder for the user.
        """
        folder = Folder(**folder_data.model_dump(), user_id=user.id)
        self.db.add(folder)
        await self.db.commit()
        await self.db.refresh(folder)
        return folder
    
    async def update_folder(self, folder_id: UUID, update_data: FolderUpdate, user: User) -> Folder:
        """
        Update an existing folder if it belongs to the user.
        Only fields explicitly provided will be updated.
        """        
        folder = await self.get_folder(folder_id, user)
        for field, value in update_data.model_dump(exclude_unser=True).items():
            setattr(folder, field, value)
        await self.db.commit()
        await self.db.refresh(folder)
        return folder
    
    async def delete_folder(self, folder_id: UUID, user: User) -> None:
        """
        Delete a folder by its ID if it belongs to the user.
        """
        folder = await self.get_folder(folder_id, user)
        await self.db.delete(folder)
        await self.db.commit()