import pytest
from src.auth.service import UserService
from src.db.models.user import User
from src.schemas.user import UserCreate


@pytest.mark.asyncio
async def test_register(async_session):
    # Arrange
    service = UserService(async_session)
    user_data = UserCreate(
        first_name="John", 
        last_name="Doe", 
        email="johndoe@example.com",
        password="ExamplePassword123")
    # Act
    new_user = await service.register(user_data)
    await async_session.commit()
    await async_session.refresh(new_user)

    # Assert
    db_user = await async_session.get(User, new_user.id)
    assert db_user is not None
    assert db_user.first_name == "John"
    assert db_user.last_name == "Doe"
    assert db_user.email == "johndoe@example.com"
