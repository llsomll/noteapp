from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy_utils import create_database, database_exists
from typing import Annotated
from fastapi import Depends


from src.settings import settings
from .base import Base

# Create the async database engine using the URI from your settings
engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
# Create an async session factory (used to connect to the DB)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

# FastAPI dependency function to yield a database session
# This ensures sessions are cleaned up automatically (using async context)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

# allow to use `db: DbContext` in the route parameters
# A type alias combining AsyncSession with FastAPI's Depends
DbContext = Annotated[AsyncSession, Depends(get_db)]

# Function to create all tables based on SQLAlchemy models
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def setup_db():
    print("Creating tables if they do not exist...")
    await create_tables()
    print("Done.")
