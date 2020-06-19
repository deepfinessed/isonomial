from typing import List

import requests

from app.core.config import settings
from app.schemas.location import *

GOOGLE_BASE_API_URI = 'https://maps.googleapis.com/maps/api/geocode/json'

RELEVANT_GOOGLE_LOCATION_SCOPES = {
    'country', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3',
    'administrative_area_level_4', 'administrative_area_level_5', 'colloquial_area', 'locality', 'sublocality',
    'neighborhood'
}


def get_google_location_scopes(position: LocationPost) -> List[LocationScope]:
    latlng = str(position.latitude) + ',' + str(position.longitude)
    payload = {'latlng': latlng, 'key': settings.GOOGLE_MAPS_API_KEY}
    req = requests.get(GOOGLE_BASE_API_URI, params=payload)
    response: GoogleGeocodingResponse = GoogleGeocodingResponse(**req.json())
    results = response.results
    returned_scopes = []
    components = results[0].address_components
    for component in components:
        # check if result is relevant for app
        for type in component.types:
            if type in RELEVANT_GOOGLE_LOCATION_SCOPES:
                returned_scopes.append(LocationScope(name=component.long_name, type=type))
    return returned_scopes
