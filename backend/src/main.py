from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware  # allow the frontend to send request to backend
import logging
from fastapi.routing import APIRoute
from src.api.routers import router
from src.settings import settings
from src.db.database import setup_db

logger = logging.getLogger(settings.ENVIRONMENT)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await setup_db()
        yield
        logger.info("Shutdown complete.")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

app = FastAPI(
    title="NoteApp API",
    description="A simple note app with folders and user support.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:5173",

]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Include routers
app.include_router(router)

# Simplify OpenAPI operation IDs
def use_route_names_as_operation_ids(app: FastAPI) -> None:
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name
