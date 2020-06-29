import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

import Config from '../config/Config';
import {UserContext} from '../utils/UserContext';
import {NetworkContext} from '../utils/NetworkContext';
import {styles} from '../styles/defaultStyles';

export default function CreatePostScreen(props) {
  const [text, setText] = useState('');
  const network = useContext(NetworkContext);
  const user = useContext(UserContext);

  function onSubmit() {
    const targetURI = Config.BASE_API_URI + 'posts/create';

    const payload = {
      scopes: user.locationScopes,
      text: text,
    };

    console.log('Creating post with scopes:');
    console.log(user.locationScopes);

    fetch(targetURI, {
      method: 'POST',
      headers: network.authenticatedHeader,
      body: JSON.stringify(payload),
    }).then(async response => {
      if (response.ok) {
        //debug
        response.json().then(obj => console.log(obj));
        //end debug
        props.navigation.navigate('Posts');
      } else if (response.status === 401) {
        await network.refreshAccessToken();
        onSubmit();
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  }

  return (
    <View>
      <View>
        <TextInput
          multiline={true}
          onChangeText={input => setText(input)}
          autoFocus={true}
          placeholder={'Post your thoughts!'}
          numberOfLines={10}
        />
      </View>
      <Button title="Post" onPress={onSubmit} />
      <Button
        title={
          'Go back to posts in ' +
          (user.activeScope ? user.activeScope : 'your area')
        }
        onPress={() => props.navigation.navigate('Posts')}
      />
    </View>
  );
}
