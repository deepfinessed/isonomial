import React from 'react';
import {Button, Text, View} from 'react-native';

import {styles} from '../styles/defaultStyles';

export default function WelcomeScreen(props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>
        Welcome to Isonomial!
      </Text>
      <Text style={styles.body}>
        Welcome to Isonomial, the anonymous, location based messaging app. If
        you're new to the app, please take a moment to sign up with us:
      </Text>
      <Button
        title="Sign Up"
        onPress={() => props.navigation.navigate('Sign Up')}
      />
      <Text style={styles.body}>
        If you already have an account with us, please log in:
      </Text>
      <Button
        title="Login"
        onPress={() => props.navigation.navigate('Login')}
      />
    </View>
  );
}
