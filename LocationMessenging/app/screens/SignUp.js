import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {Card, Input, Icon} from 'react-native-elements';

function SignUpScreen() {}

export default function SignUpEmailForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repassword, setRepassword] = useState('');

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
    if(isValid){
      alert('You have submitted');
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
