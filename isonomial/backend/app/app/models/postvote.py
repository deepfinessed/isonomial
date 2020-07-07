from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .post import Post  # noqa: F401
    from .user import User  # noqa: F401


class PostVote(Base):
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    value = Column(Integer)

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="votes")

    post_id = Column(Integer, ForeignKey("post.id"), index=True)
    post = relationship("Post", back_populates="votes")

    __table_args__ = (UniqueConstraint('user_id', 'post_id', name='_user_post_uc'),
                      )


