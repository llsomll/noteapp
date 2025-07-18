import sys
import os
from collections.abc import AsyncGenerator
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from src.db.base import Base
from src.settings import settings

# Ensure src is on path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

DATABASE_URL = settings.DATABASE_TEST_URL
assert "test" in DATABASE_URL, "Refusing to run tests on non-test database!"


# Creates and disposes a shared SQLAlchemy async engine
@pytest_asyncio.fixture(scope="session")

async def async_engine():
    engine = create_async_engine(DATABASE_URL, echo=True)
    yield engine
    await engine.dispose()


# Creates tables before the test suite, and drops them afterward
@pytest_asyncio.fixture(scope="session", autouse=True)
async def prepare_database(async_engine):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# Yields a new AsyncSession for each test
@pytest_asyncio.fixture(scope="function")
async def async_session(async_engine) -> AsyncGenerator[AsyncSession, None]:
    async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.rollback()