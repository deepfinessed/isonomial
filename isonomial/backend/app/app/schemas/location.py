from datetime import datetime
from typing import Optional, Any, List

from pydantic import BaseModel


class LocationPost(BaseModel):
    latitude: float
    longitude: float
    timestamp: datetime


class LocationScope(BaseModel):
    name: str
    type: str


class GoogleGeocodingAddressComponent(BaseModel):
    long_name: str
    short_name: str
    types: List[str]


class GoogleGeocodingResult(BaseModel):
    address_components: List[GoogleGeocodingAddressComponent]
    formatted_address: str
    geometry: Any
    place_id: str
    plus_code: Any
    types: List[str]


class GoogleGeocodingResponse(BaseModel):
    plus_code: Any
    results: List[GoogleGeocodingResult]
    status: str
