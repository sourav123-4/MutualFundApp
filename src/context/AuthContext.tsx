import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearAuthToken,
  getAuthToken,
  saveAuthToken,
} from '../services/secureStorage';

type AuthContextValue = {
  isBooting: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const DUMMY_TOKEN = 'fundly-demo-token';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isBooting, setIsBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAuthToken()
      .then(savedToken => {
        if (active) {
          setToken(savedToken);
        }
      })
      .catch(() => {
        if (active) {
          setToken(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsBooting(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    await saveAuthToken(DUMMY_TOKEN);
    setToken(DUMMY_TOKEN);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthToken();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      isBooting,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [isBooting, signIn, signOut, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
};
