from typing import Optional
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..base import Base, IdMixin, TimestampMixin, str_50, str_500



# SQLAlchemy Folder model

class Note(Base, IdMixin, TimestampMixin):
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, index=True)
    folder_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("folder.id"), nullable=True, index=True)
    title: Mapped[str_50]
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_starred: Mapped[bool] = mapped_column(default=False, index=True)

    # ORM relationships (joined by user_id and folder_id)
    user = relationship("User", back_populates="notes")
    folder = relationship("Folder", back_populates="notes")



