import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..base import Base, IdMixin, TimestampMixin, str_20
from .note import Note


# SQLAlchemy Folder model

class Folder(Base, IdMixin, TimestampMixin):
    name: Mapped[str_20]
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, index=True)

    # Relationship to notes (one-to-many)
    notes: Mapped[list["Note"]] = relationship(back_populates="folder")

    # ORM relationship to owning user
    user = relationship("User", back_populates="folders")


