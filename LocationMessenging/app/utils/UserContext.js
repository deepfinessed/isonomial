import React, {useState} from 'react';

export const UserContext = React.createContext(null);

export default ({children}) => {
  const [accessToken, setAccessToken] = useState();
  const [location, setLocation] = useState();
  const [locationLastUpdateTime, setLocationLastUpdateTime] = useState();

  const userContext = {
    accessToken: [accessToken, setAccessToken],
    location: [location, setLocation],
    locationLastUpdateTime: [locationLastUpdateTime, setLocationLastUpdateTime],
  };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
