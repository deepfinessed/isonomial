// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator,
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
  const [posts: Array<Post>, setPosts] = React.useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBottom, setLoadingBottom] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
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

  useFocusEffect(
    useCallback(() => {
      Geolocation.getCurrentPosition(
        loc => {
          console.log(loc);
          let locationPost = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
          };
          let targetURI =
            Config.BASE_API_URI + 'utils/get-scopes-from-location/';
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
        error => console.log(error),
      );
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!user.activeScope && user.locationScopes.length !== 0) {
        user.setActiveScope(user.locationScopes[0]);
      }
    }, [user]),
  );

  function handleLoadMore() {
    setLoadingBottom(true);
    setPage(oldPage => oldPage + 1);
    fetchPosts();
  }

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
            if (!user.activeScope) {
              user.setActiveScope(user.setLocationScopes[0]);
            }
          });
      },
      error => console.log(error),
    );
  }

  function clearData() {
    AsyncStorage.removeItem('accessToken');
    user.setIsLoggedIn(false);
  }

  function renderPost(iterator: FlatListIterator) {
    const post: Post = iterator.item[0];
    return (
      <View style={postStyles.parentContainer}>
        <View style={postStyles.voteContainer}>
          <Icon.Button
            name="chevron-up"
            onPress={() => sendVote(1, post.id)}
            backgroundColor="transparent"
            color="#007AFF"
            underlayColor="lightskyblue"
            iconStyle={{marginRight: 0}}
          />
          <Text>{post.score}</Text>
          <Icon.Button
            name="chevron-down"
            onPress={() => sendVote(-1, post.id)}
            backgroundColor="transparent"
            color="#007AFF"
            underlayColor="lightskyblue"
            iconStyle={{marginRight: 0}}
          />
          <Moment
            element={Text}
            style={postStyles.footerText}
            fromNow={true}
            date={post.date}
          />
        </View>
        <View style={postStyles.textContainer}>
          <Text style={postStyles.locationText}>
            <Icon name="map-marker" /> {post.neighborhood}
          </Text>
          <Text>{post.text}</Text>
        </View>
      </View>
    );
  }

  function sendVote(value: number, postID: number) {
    const targetURI = Config.BASE_API_URI + 'posts/vote';
    const requestBody = {
      value: value,
      post_id: postID,
    };
    fetch(targetURI, {
      method: 'POST',
      headers: network.authenticatedHeader,
      body: JSON.stringify(requestBody),
    }).then(response => {
      if (!response.ok) {
        console.log(response.statusText);
      }
    });
  }

  function renderFooter() {
    if (!hasMorePosts) {
      return <Text>There are no more posts in this category</Text>;
    }
    if (!loadingBottom) {
      return null;
    }
    return <ActivityIndicator animating size={'large'} />;
  }

  function fetchPosts() {
    const targetURI = Config.BASE_API_URI + 'posts/get';
    const requestBody = {
      scopes: user.locationScopes,
      active_scope: user.activeScope,
      page: page,
    };

    console.log(network.authenticatedHeader);
    console.log(requestBody);

    fetch(targetURI, {
      method: 'POST',
      headers: network.authenticatedHeader,
      body: JSON.stringify(requestBody),
    }).then(response => {
      if (response.ok) {
        response.json().then(newPosts => {
          console.log(newPosts);
          setPosts(oldPosts =>
            page === 0 ? [...newPosts] : [...oldPosts, ...newPosts],
          );
          if (newPosts.length < Config.POSTS_PER_PAGE) {
            setHasMorePosts(false);
          }
          setIsLoading(false);
          console.log(posts);
        });
      } else if (response.status === 401) {
        network.refreshAccessToken().then(() => fetchPosts());
      } else {
        console.log(response);
      }
    });
  }

  //useEffect(fetchPosts, []);

  return (
    <View style={postStyles.postScreen}>
      <View>
        <Text style={styles.sectionTitle}>
          You have made it to the posts page.
        </Text>
        <Button title="Test geolocation" onPress={testGeolocation} />
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item[0].id.toString()}
        onEndReached={hasMorePosts ? handleLoadMore : () => {}}
        onEndReachedThreshold={0.25}
        initialNumToRender={Config.POSTS_PER_PAGE}
        ListFooterComponent={renderFooter}
      />
      <View>
        <Icon.Button name="pencil" onPress={() => nav.navigate('CreatePost')}>
          Make a Post
        </Icon.Button>
      </View>
      <Button title="Get Posts" onPress={fetchPosts} />
      <Button title="Clear Data" onPress={clearData} />
    </View>
  );
}
