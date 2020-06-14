import * as Keychain from 'react-native-keychain';

export async function getRefreshToken() {
  try {
    let refreshToken = await Keychain.getInternetCredentials('isonomial');
    return refreshToken.password;
  } catch (error) {
    console.log(error);
  }
}

export async function storeRefreshToken(token) {
  try {
    await Keychain.setInternetCredentials('isonomial', 'user', 'token');
  } catch (error) {
    console.log(error);
  }
}
