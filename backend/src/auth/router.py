from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Cookie, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from src.auth.models import Token
from src.auth.service import UserServiceDep
from src.schemas.user import UserCreate, UserOut
from src.settings import settings
from .security import create_access_token, create_refresh_token, decode_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token, status_code=200, operation_id="login")
async def login(
    service: UserServiceDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    Login with OAuth2 credentials. Returns access token in JSON and refresh token in HttpOnly cookie.
    """
    user = await service.authenticate(
        email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.id, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(user.id)

    # Return access token in JSON, set refresh token as HttpOnly cookie
    response = JSONResponse(
        content={
            "access_token": access_token,
            "token_type": "bearer"
        }
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True, 
        secure=False,  # True in production
        samesite="Lax",
        domain="localhost",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return response


@router.post("/logout", operation_id="logout")
async def logout():
    response = JSONResponse(content={"detail": "Logged out"})
    response.delete_cookie(
        key="refresh_token",
        httponly=True, 
        secure=False,  # True in production
        samesite="Lax",
        domain="localhost",
        path="/",
    )

    return response


@router.post("/register", response_model=UserOut, status_code=201, operation_id="registerUser")
async def register_user(service: UserServiceDep, user_in: UserCreate):
    """
    Create new user without the need to be logged in.
    """
    user = await service.register(user_in)
    return user


@router.post("/refresh", response_model=Token, operation_id="refreshToken")
async def refresh_token(refresh_token: Annotated[str | None, Cookie()] = None):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = decode_refresh_token(refresh_token)
        user_id = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(
        subject=user_id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }
