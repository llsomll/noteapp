from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from src.auth.models import Token
from src.auth.service import UserServiceDep
from src.schemas.user import UserCreate, UserOut
from src.settings import settings
from .security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token, status_code=200, operation_id="login")
async def login(
    service: UserServiceDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await service.authenticate(
        email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=create_access_token(user.id, expires_delta=access_token_expires),
        token_type="bearer"
    )


@router.post("/register", response_model=UserOut, status_code=201, operation_id="registerUser")
async def register_user(service: UserServiceDep, user_in: UserCreate):
    """
    Create new user without the need to be logged in.
    """
    user = await service.register(user_in)
    return user
