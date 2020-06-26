import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const postStyles = StyleSheet.create({
  parentContainer: {
    marginTop: 15,
    width: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteContainer: {
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },

  locationText: {
    color: 'skyblue',
    alignSelf: 'flex-end',
  },

  footerText: {
    color: 'lightgray',
    alignSelf: 'flex-end',
  },
});

export {postStyles};
