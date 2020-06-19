from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas import User

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


class PostCreate(PostBase):
    pass


class PostInDB(PostBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class Post(PostInDB):
    pass
