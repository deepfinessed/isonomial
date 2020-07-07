import React, {useContext, useState} from 'react';
import {View, Button} from 'react-native';
import {Card, Input, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Config from '../config/Config';
import {storeRefreshToken, getRefreshToken} from '../utils/credentials';
import {UserContext} from '../utils/UserContext';
import {NetworkContext} from '../utils/NetworkContext';

function LoginEmailForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const user = useContext(UserContext);
  const network = useContext(NetworkContext);

  function validateEmail() {
    let regexEmail = new RegExp(
      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
    );
    let isValid = regexEmail.test(email);
    if (!isValid) {
      setEmailError('Email is invalid');
    } else {
      setEmailError('');
    }
    return isValid;
  }

  async function submitLogin() {
    const formData = {
      username: email,
      password: password,
    };
    //manually build www-urlencoded form for backend
    let formBody = [];
    for (let item in formData) {
      let key = encodeURIComponent(item);
      let value = encodeURIComponent(formData[item]);
      formBody.push(key + '=' + value);
    }
    formBody = formBody.join('&');
    //and send the request

    let uriTarget = Config.BASE_API_URI + 'login/refresh-token';

    const response = await fetch(uriTarget, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    if (response.ok) {
      response.json().then(data => {
        storeRefreshToken(data.refresh_token).then(() => {});
        user.setAccessToken(data.access_token);
        AsyncStorage.setItem('accessToken', data.access_token);
        network.setAuthenticatedHeader({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + data.access_token,
        });
        user.setIsLoggedIn(true);
      });
    } else {
      setEmailError('Incorrect email or password');
      setPasswordError('Incorrect email or password');
    }
  }

  function onSubmit() {
    let isValid = validateEmail();

    //for testing
    if (isValid) {
      submitLogin();
    }
  }

  return (
    <View>
      <Card title="Login">
        <Input
          label="Email Address"
          placeholder="Email Address"
          textContentType="emailAddress"
          leftIcon={{
            type: 'material-community',
            name: 'email',
          }}
          onChangeText={text => {
            setEmail(text);
            if (emailError) {
              validateEmail();
            }
          }}
          errorMessage={emailError}
        />
        <Input
          label="Password"
          placeholder="Password"
          secureTextEntry={true}
          textContentType="newPassword"
          leftIcon={{
            type: 'material',
            name: 'lock',
          }}
          onChangeText={text => {
            setPassword(text);
          }}
          errorMessage={passwordError}
        />
        <Button onPress={onSubmit} title="Login" />
      </Card>
    </View>
  );
}

export default function LoginScreen() {
  return <LoginEmailForm />;
}
