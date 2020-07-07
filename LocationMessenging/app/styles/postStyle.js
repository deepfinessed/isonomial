import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const postStyles = StyleSheet.create({
  postScreen: {
    backgroundColor: 'lightgray',
  },
  parentContainer: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  voteContainer: {
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },

  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },

  locationText: {
    color: 'skyblue',
    textAlign: 'center',
  },

  footerText: {
    color: 'lightgray',
  },

  voteIcons: {
    backgroundColor: 'transparent',
    color: '#007AFF',
  },
});

export {postStyles};
