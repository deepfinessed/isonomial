from datetime import datetime, timedelta
from typing import Optional, List

from pydantic import BaseModel

from app.core.config import settings
from app.schemas import User, LocationScope

RELEVANT_GOOGLE_LOCATION_SCOPES = {
    'country', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3',
    'administrative_area_level_4', 'administrative_area_level_5', 'colloquial_area', 'locality', 'sublocality',
    'neighborhood'
}


class PostBase(BaseModel):
    text: str
    score: int = 0
    date: Optional[datetime] = None

    # SCOPES
    #  Google Geolocation Scopes
    country: Optional[str] = None
    sublocality: Optional[str] = None
    neighborhood: Optional[str] = None
    colloquial_area: Optional[str] = None
    administrative_area_level_3: Optional[str] = None
    administrative_area_level_1: Optional[str] = None
    administrative_area_level_2: Optional[str] = None
    administrative_area_level_5: Optional[str] = None
    locality: Optional[str] = None
    administrative_area_level_4: Optional[str] = None

    #  END Google Geolocation Scopes
    # END SCOPES


class PostCreate(BaseModel):
    text: str
    scopes: List[LocationScope]


class PostInDB(PostBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class Post(PostInDB):
    def __repr__(self):
        return "%s(%r)" % (self.__class__, self.__dict__)


class PostRequest(BaseModel):
    scopes: List[LocationScope]
    active_scope: LocationScope
    page: Optional[int] = 0
    order_by: Optional[str] = 'date'
    after_date: Optional[datetime] = datetime.utcnow() - timedelta(minutes=settings.DEFAULT_GET_POSTS_EXPIRE_MINUTES)

