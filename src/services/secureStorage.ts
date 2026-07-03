import * as Keychain from 'react-native-keychain';

const AUTH_SERVICE = 'com.mutualfundapp.auth';
const TOKEN_ACCOUNT = 'mutual-fund-user';

export const saveAuthToken = async (token: string) => {
  await Keychain.setGenericPassword(TOKEN_ACCOUNT, token, {
    service: AUTH_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const getAuthToken = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_SERVICE,
  });

  return credentials ? credentials.password : null;
};

export const clearAuthToken = async () => {
  await Keychain.resetGenericPassword({ service: AUTH_SERVICE });
};
