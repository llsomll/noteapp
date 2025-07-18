from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Boolean
from src.db.base import Base, IdMixin, TimestampMixin, str_100, str_40, str_50
from .note import Note
from .folder import Folder


# SQLAlchemy Folder model

class User(Base, IdMixin, TimestampMixin):
    first_name: Mapped[str_40]
    last_name: Mapped[str_40]
    email: Mapped[str_50] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str_100]
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, index=True)

    # Relationship to notes (one-to-many)
    notes: Mapped[list["Note"]] = relationship(back_populates="user")
    folders: Mapped[list["Folder"]] = relationship(back_populates="user")



