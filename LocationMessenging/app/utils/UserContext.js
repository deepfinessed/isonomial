import React, {useState} from 'react';



export const UserContext = React.createContext(null);

export default ({children}) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLastUpdateTime, setLocationLastUpdateTime] = useState(null);
  const [locationScopes, setLocationScopes] = React.useState([]);
  const [activeScope, setActiveScope] = React.useState(null);

  const userContext = {
    accessToken: accessToken,
    setAccessToken: setAccessToken,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn,
    location: location,
    setLocation: setLocation,
    locationLastUpdateTime: locationLastUpdateTime,
    setLocationLastUpdateTime: setLocationLastUpdateTime,
    locationScopes: locationScopes,
    setLocationScopes: setLocationScopes,
    activeScope: activeScope,
    setActiveScope: setActiveScope,
  };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
