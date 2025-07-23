from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from src.db.database import DbContext
from src.db.models.user import User
from src.schemas.folder import FolderCreate, FolderUpdate, FolderOut
from src.services.folder_service import FolderService
from src.auth.deps import CurrentUser

router = APIRouter(prefix="/folder", tags=["folders"])

@router.get("/", response_model=List[FolderOut], operation_id="getFolders")
async def get_folders(
    current_user: CurrentUser,
    db: DbContext,  
    
):
    return await FolderService(db).get_folders_for_user(current_user)


@router.get("/{folder_id}", response_model=FolderOut, operation_id="getFolder")
async def get_folder(
    folder_id: UUID,
    current_user: CurrentUser,
    db: DbContext,  
    
):
    return await FolderService(db).get_folder(folder_id, current_user)


@router.post("/", response_model=FolderOut, operation_id="createFolder")
async def create_folder(
    folder_data: FolderCreate,
    current_user: CurrentUser,
    db: DbContext,  
    
):
    return await FolderService(db).create_folder(folder_data, current_user)


@router.put("/{folder_id}", response_model=FolderOut, operation_id="updateFolder")
async def update_folder(
    folder_id: UUID,
    folder_data: FolderUpdate,
    current_user: CurrentUser,
    db: DbContext,  
       
):
    return await FolderService(db).update_folder(folder_id, folder_data, current_user)


@router.delete("/{folder_id}", status_code=204, operation_id="deleteFolder")
async def delete_folder(
    folder_id: UUID,
    current_user: CurrentUser,
    db: DbContext,  
    
):
    await FolderService(db).delete_folder(folder_id, current_user)