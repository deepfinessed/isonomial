import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import {UserContext} from '../utils/UserContext';
import SignUpScreen from '../screens/SignUp';
import LoginScreen from '../screens/Login';
import WelcomeScreen from '../screens/Welcome';
import PostScreen from '../screens/Posts';

const TopLevelStack = createStackNavigator();

export default function TopLevelNavigator() {
  const user = useContext(UserContext);

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      if (token) {
        user.setAccessToken(token);
        user.setIsLoggedIn(true);
      }
    });
  }, [user]);

  return (
    <TopLevelStack.Navigator>
      {user.isLoggedIn ? (
        <>
          <TopLevelStack.Screen name="Posts" component={PostScreen} />
        </>
      ) : (
        <>
          <TopLevelStack.Screen name="Welcome" component={WelcomeScreen} />
          <TopLevelStack.Screen name="Sign Up" component={SignUpScreen} />
          <TopLevelStack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </TopLevelStack.Navigator>
  );
}
