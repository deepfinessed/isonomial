import React, {useState} from 'react';
import {AsyncStorage} from '@react-native-community/async-storage';

import Config from '../config/Config';
import {getRefreshToken} from './credentials';

export const NetworkContext = React.createContext(null);

export default ({children}) => {
  async function refreshAccessToken() {
    let refreshURL = Config.BASE_API_URI + '/login/refresh-for-access-token';
    let refreshToken = getRefreshToken();
    let bodyObj = {refresh_token: refreshToken};
    let response = await fetch(refreshURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
    });
    if (response.ok) {
      let respObj = await response.json();
      let storePromise = AsyncStorage.setItem(
        'accessToken',
        respObj.access_token,
      );
      await storePromise;
    } else if (response.status === 401) {
    } else {

    }
  }
}


