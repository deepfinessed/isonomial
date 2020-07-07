from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # noqa: F401


class Post(Base):
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    score = Column(Integer)
    date = Column(DateTime, index=True)

    # SCOPES
    #  GOOGLE GEOLOCATION SCOPES
    country = Column(String, index=True, nullable=True)
    sublocality = Column(String, index=True, nullable=True)
    neighborhood = Column(String, index=True, nullable=True)
    colloquial_area = Column(String, index=True, nullable=True)
    administrative_area_level_3 = Column(String, index=True, nullable=True)
    administrative_area_level_1 = Column(String, index=True, nullable=True)
    administrative_area_level_2 = Column(String, index=True, nullable=True)
    administrative_area_level_5 = Column(String, index=True, nullable=True)
    locality = Column(String, index=True, nullable=True)
    administrative_area_level_4 = Column(String, index=True, nullable=True)

    #  END GOOGLE GEOLOCATION SCOPES
    # END SCOPES

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="posts")

    votes = relationship("PostVote", back_populates="post")

    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)


