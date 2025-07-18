from fastapi import APIRouter
from .note_router import router as note_router
from .folder_router import router as folder_router
from ..auth.router import router as auth_router
from .user_router import router as user_router
from src.settings import settings

router = APIRouter(prefix=settings.API_V1_STR)

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(note_router)
router.include_router(folder_router)
