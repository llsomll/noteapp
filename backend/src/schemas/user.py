from pydantic import Field, EmailStr
from datetime import datetime
from src.db.base import PydanticBase
import uuid

# Pydantic schemas

class UserBase(PydanticBase):
    first_name: str = Field(..., max_length=40)
    last_name: str = Field(..., max_length=40)
    email: EmailStr
    is_active: bool = True


class UserOut(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
     password: str = Field(min_length=8, max_length=40)


class UserLogin(PydanticBase):
    email: EmailStr
    password: str


# class UserUpdate(PydanticBase):
#     first_name: Optional[str] = Field(None, max_length=40)
#     last_name: Optional[str] = Field(None, max_length=40)
#     email: Optional[EmailStr] = None
#     password: Optional[str] = Field(None, min_length=8, max_length=40)
#     is_active: Optional[bool] = None