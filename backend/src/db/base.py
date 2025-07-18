from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, registry
from sqlalchemy.ext.declarative import declared_attr
import re # Regular expressions
from pydantic import ConfigDict, BaseModel
from typing import Annotated, Optional
from sqlalchemy import String, func, DateTime
from datetime import datetime, timezone
from src.shared.types import str_20, str_40, str_50, str_100, str_500
import uuid
from sqlalchemy.dialects.postgresql import UUID



# Create a custom registry to manage model metadata (for migrations)
model_registry = registry()

# Helper function to convert CamelCase → snake_case (used for table names)
def camel_to_snake(name: str):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()

# Base class for all Pydantic schemas (DTOs) in your app
class PydanticBase(BaseModel):
    # Pydantic V2 config: allows ORM-to-Pydantic model conversion with .model_validate()
    model_config = ConfigDict(
        from_attributes=True, # enables .model_validate(orm_obj)
        extra="ignore" # ignores unexpected fields instead of throwing errors
    )

# SQLAlchemy base model class that all models will inherit from
class Base(DeclarativeBase):
    # Link it to the custom registry you defined above
    registry = model_registry

    # Automatically generate __tablename__ for each model based on the class name
    @declared_attr.directive
    def __tablename__(cls):
        return camel_to_snake(cls.__name__) # "UserAccount" → "user_account"

# A mixin to add a standard 'id' primary key column to any model
class IdMixin:
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


# A mixin to automatically add created_at and updated_at timestamps to models
class TimestampMixin:
     # Sets created_at using the database's current timestamp at insert time
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    # Sets updated_at using Python at insert time,
    # and automatically updates it to the current UTC time on every update
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )



# In object-oriented programming, a mixin is a class that provides methods 
# for other classes to inherit or utilize, without being the parent class. 
# Mixins are a way to reuse code and add functionality to classes 
# without using traditional inheritance. They are particularly useful 
# when you need to share methods across multiple classes 
# without creating a tight hierarchy. 