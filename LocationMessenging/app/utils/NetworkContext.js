import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import Config from '../config/Config';
import {getRefreshToken} from './credentials';
import {UserContext} from './UserContext';

export const NetworkContext = React.createContext(null);

export default ({children}) => {
  const user = React.useContext(UserContext);

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
      user.setAccessToken(respObj.access_token);
      await storePromise;
    } else if (response.status === 401) {
      user.setIsLoggedIn('false');
      user.setAccessToken(null);
      //nav.navigate('Login');
    } else {
      console.log('Something has gone wrong! Response: ' + response.statusText);
    }
  }

  const authenticatedHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + user.accessToken,
  };

  const networkContext = {
    refreshAccessToken: refreshAccessToken,
    authenticatedHeader: authenticatedHeader,
  };

  return (
    <NetworkContext.Provider value={networkContext}>
      {children}
    </NetworkContext.Provider>
  );
};
