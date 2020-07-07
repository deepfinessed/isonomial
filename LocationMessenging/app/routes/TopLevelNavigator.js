import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import {UserContext} from '../utils/UserContext';
import SignUpScreen from '../screens/SignUp';
import LoginScreen from '../screens/Login';
import WelcomeScreen from '../screens/Welcome';
import PostScreen from '../screens/Posts';
import {Drawer, CustomDrawerContent} from './DrawerNavigator';
import DrawerNavigator from './DrawerNavigator';
import CreatePostScreen from '../screens/CreatePost';
import {NetworkContext} from '../utils/NetworkContext';

const TopLevelStack = createStackNavigator();

export default function TopLevelNavigator() {
  const user = useContext(UserContext);
  const network = useContext(NetworkContext);

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      if (token) {
        user.setAccessToken(token);
        network.setAuthenticatedHeader({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        });
        user.setIsLoggedIn(true);
      }
    });
  }, [user]);

  return (
    <TopLevelStack.Navigator>
      {user.isLoggedIn ? (
        <>
          <TopLevelStack.Screen name="Drawer" component={DrawerNavigator} />
          <TopLevelStack.Screen
            name="CreatePost"
            component={CreatePostScreen}
          />
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
