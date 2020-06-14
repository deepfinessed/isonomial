import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {Card, Input, Icon} from 'react-native-elements';

function LoginEmailForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  function onSubmit() {
    let isValid = validateEmail();

    //for testing
    if (isValid) {
      alert('You have submitted');
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
