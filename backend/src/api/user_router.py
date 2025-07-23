from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlalchemy import select

from src.db.database import DbContext
from src.db.models.user import User
from src.schemas.user import UserOut
from src.auth.deps import get_current_user

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/me", response_model=UserOut, operation_id="getCurrentUser")
async def get_current_user_route(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserOut, operation_id="readUser")
async def read_user(user_id: UUID, db: DbContext):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

