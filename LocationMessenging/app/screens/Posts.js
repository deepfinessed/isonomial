import React, {useCallback, useContext, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Moment from 'react-moment';

import Config from '../config/Config';
import {UserContext} from '../utils/UserContext';
import {NetworkContext} from '../utils/NetworkContext';
import {styles} from '../styles/defaultStyles';
import {useNavigation} from '@react-navigation/core';
import {useFocusEffect} from '@react-navigation/native';
import {postStyles} from '../styles/postStyle';

export default function PostScreen(props) {
  const [locationScope, setLocationScope] = React.useState(null);
  const [geolocatedLocation, setGeoLocatedLocation] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const user = useContext(UserContext);
  const network = useContext(NetworkContext);
  const nav = useNavigation();

  //get permissions on android
  useEffect(() => {
    async function getPerms() {
      if (Platform.OS === 'android') {
        AsyncStorage.getItem('hasLocationPermission').then(async item => {
          if (!item) {
            try {
              const perms = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Isonomial Location Permission',
                  message:
                    'Isonomial needs access to your location to figure out which posts to display',
                  buttonNeutral: 'Ask me later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
              if (perms === PermissionsAndroid.RESULTS.GRANTED) {
                AsyncStorage.setItem('hasLocationPermission', 'true');
              } else {
                alert('Isonomial cannot function without location permissions');
              }
            } catch (err) {
              console.warn(err);
            }
          }
        });
      }
    }
    getPerms();
  }, []);

  const updateLocationScopes = React.useCallback(
    location =>
      function updateScopes(loc) {
        console.log(loc);
        let locationPost = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        };
        let targetURI = Config.BASE_API_URI + 'utils/get-scopes-from-location';
        fetch(targetURI, {
          method: 'POST',
          headers: network.authenticatedHeader,
          body: JSON.stringify(locationPost),
        })
          .then(response => response.json())
          .then(data => {
            user.setLocationScopes(data);
            if (!user.activeScope) {
              user.setActiveScope(user.locationScopes[0]);
            }
          });
      },
    [network.authenticatedHeader, user],
  );

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => updateLocationScopes(position),
      error => console.log(error),
    );
  }, [updateLocationScopes]);

  useFocusEffect(
    useCallback(() => {
      if (!user.activeScope) {
        user.setActiveScope(user.locationScopes[0].name);
      }
    }, [user]),
  );

  function testGeolocation() {
    Geolocation.getCurrentPosition(
      loc => {
        console.log(loc);
        let locationPost = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        };
        let targetURI = Config.BASE_API_URI + 'utils/get-scopes-from-location/';
        fetch(targetURI, {
          method: 'POST',
          headers: network.authenticatedHeader,
          body: JSON.stringify(locationPost),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            user.setLocationScopes(data);
          });
      },
      error => console.log(error),
    );
  }

  function renderPost(post) {
    return (
      <View style={postStyles.parentContainer}>
        <View style={postStyles.voteContainer}>
          <Icon.Button name="chevron-up" onPress={() => {}} />
          <Text>{post.text}</Text>
          <Icon.Button name="chevron-down" onPress={() => {}} />
        </View>
        <Moment style={postStyles.footerText} fromNow={true} date={post.date} />
        <View style={postStyles.textContainer}>
          <Text style={postStyles.locationText}>
            <Icon name="map-marker-alt" /> {post.}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View>
        <Text style={styles.sectionTitle}>
          You have made it to the posts page.
        </Text>
        <Button title="Test geolocation" onPress={testGeolocation} />
      </View>
      <View>
        <Icon.Button name="pencil" onPress={() => nav.navigate('CreatePost')}>
          Make a Post
        </Icon.Button>
      </View>
    </View>
  );
}
