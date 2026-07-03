import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import SchemeDetail from '../screens/protected/SchemeDetail';
import SchemeList from '../screens/protected/SchemeList';
import Login from '../screens/public/auth/Login';
import { Colors, Fonts } from '../themes';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const { isAuthenticated, isBooting } = useAuth();

  if (isBooting) {
    return (
      <View style={styles.boot}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <LoadingState message="Preparing your portfolio..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: Colors.text,
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { fontFamily: Fonts.bold },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="SchemeList"
              component={SchemeList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SchemeDetail"
              component={SchemeDetail}
              options={{ title: 'Scheme details', headerBackTitle: 'Funds' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    paddingTop: 160,
    backgroundColor: Colors.background,
  },
  logo: {
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -120,
    zIndex: 1,
  },
  logoText: {
    color: Colors.surface,
    fontSize: 32,
    fontFamily: Fonts.extraBold,
  },
});

export default StackNavigation;
