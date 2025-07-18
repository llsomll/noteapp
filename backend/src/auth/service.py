from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.user import UserCreate # Pydantic schema for creating a user
from src.db.database import DbContext # Dependency-injected DB session
from src.db.models.user import User # SQLAlchemy user model
from .security import verify_password, get_password_hash # Utility functions for password handling

# Service class to encapsulate authentication logic
class UserService:
    def __init__(self, db: AsyncSession):
        # Save the async DB session as an instance variable
        self.db: AsyncSession = db

    # Retrieve a user by email address (for login or duplicate check)
    async def get_user_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email) # SQLAlchemy SELECT query
        session_user = await self.db.execute(statement) # Execute the query
        return session_user.scalar_one_or_none() # Return the user if found, else None

    # Verify user's email and password for login
    async def authenticate(self, email: str, password: str) -> User | None:
        db_user = await self.get_user_by_email(email=email) # Fetch user from DB
        if not db_user:
            return None  # User not found
        if not verify_password(password, db_user.hashed_password):
            return None # Password is incorrect
        return db_user # Authentication successful

    # Register a new user in the database
    async def register(self, user_create: UserCreate) -> User:
        # Check for existing user with the same email
        existing_user = await self.get_user_by_email(user_create.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Extract user data (excluding password) and create SQLAlchemy user object
        user_data = user_create.model_dump(exclude={"password"})
        user = User(**user_data)

        # Hash the password and store it
        user.hashed_password = get_password_hash(user_create.password)

        # Persist the new user to the DB
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user # Refresh to get DB-generated fields (e.g. ID)


# Dependency function to inject UserService into FastAPI routes
def get_service(db: DbContext) -> UserService:
    return UserService(db)

# Custom type for FastAPI dependency injection
UserServiceDep = Annotated[UserService, Depends(get_service)]
