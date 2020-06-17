import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {Card, Input, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import Config from '../config/Config';

function SignUpEmailForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repassword, setRepassword] = useState('');

  const nav = useNavigation();

  async function submitSignUp() {
    const uriTarget = Config.BASE_API_URI + 'users/signup';
    const bodyObj = {
      email: email,
      password: password,
    };
    const response = await fetch(uriTarget, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
    });
    if (response.ok) {
      nav.navigate('Login');
    } else {
      //for debugging
      // console.log(uriTarget);
      // console.log(response.statusText);
      // let respObj = await response.json();
      // console.log(respObj);
      setEmailError('A user with that email already exists.');
    }
  }

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

  function validatePassword() {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (password !== repassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  }

  function onSubmit() {
    let isValid = validateEmail() && validatePassword();

    //for testing
    if (isValid) {
      submitSignUp();
    }
  }

  return (
    <View>
      <Card title="Sign Up">
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
            if (passwordError) {
              validatePassword();
            }
          }}
          errorMessage={passwordError}
        />
        <Input
          label="Re-enter Password"
          placeholder="Password"
          secureTextEntry={true}
          textContentType="newPassword"
          leftIcon={{
            type: 'material',
            name: 'lock',
          }}
          onChangeText={text => {
            setRepassword(text);
            if (passwordError) {
              validatePassword();
            }
          }}
          errorMessage={passwordError}
        />
        <Button onPress={onSubmit} title="Sign Up" />
      </Card>
    </View>
  );
}

export default function SignUpScreen() {
  return <SignUpEmailForm />;
}
