import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import StackNavigation from './src/navigation/StackNavigation';
import { Colors, normalize } from './src/themes';

const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.success,
        backgroundColor: Colors.surface,
        height: 'auto',
        minHeight: normalize(70),
        paddingVertical: normalize(12),
        borderRadius: normalize(12),
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: normalize(16) }}
      text1Style={{
        fontSize: normalize(17),
        fontWeight: '700',
        color: Colors.text,
      }}
      text2Style={{
        fontSize: normalize(14),
        color: Colors.textSecondary,
        marginTop: normalize(4),
      }}
    />
  ),
};

const App = () => (
  <GestureHandlerRootView style={styles.container}>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AuthProvider>
        <StackNavigation />
      </AuthProvider>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
