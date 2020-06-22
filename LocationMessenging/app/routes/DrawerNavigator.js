import React, {useContext, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';

import {UserContext} from '../utils/UserContext';
import PostScreen from '../screens/Posts';
import CreatePostScreen from '../screens/CreatePost';
import {useNavigation} from '@react-navigation/core';
import {Text} from 'react-native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const user = useContext(UserContext);
  const nav = useNavigation();

  function navToScope(scope) {
    user.setActiveScope(scope);
    nav.navigate('Posts');
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Location" onPress={() => {}} />
      {/* Generate Navigation for scopes */}
      {user.locationScopes.map(scope => {
        return (
          <DrawerItem
            label={() => <Text>{scope.name}</Text>}
            onPress={() => {
              navToScope(scope.name);
            }}
            focused={user.activeScope === scope.name}
          />
        );
      })}
      <DrawerItem
        label="Make a Post"
        onPress={() => nav.navigate('CreatePost')}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator(props) {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Posts" component={PostScreen} />
      <Drawer.Screen name="CreatePost" component={CreatePostScreen} />
    </Drawer.Navigator>
  );
}
