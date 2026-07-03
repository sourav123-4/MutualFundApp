import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Fonts } from '../../themes';
import AppButton from './AppButton';

type Props = {
  message: string;
  onRetry: () => void;
};

const ErrorState = ({ message, onRetry }: Props) => (
  <View style={styles.container}>
    <View style={styles.icon}>
      <Text style={styles.iconText}>!</Text>
    </View>
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.message}>{message}</Text>
    <AppButton
      title="Try again"
      onPress={onRetry}
      variant="secondary"
      style={styles.button}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorSoft,
    marginBottom: 16,
  },
  iconText: {
    color: Colors.error,
    fontSize: 26,
    fontFamily: Fonts.extraBold,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    fontFamily: Fonts.regular,
  },
  button: {
    height: 46,
    borderRadius: Radius.sm,
    marginTop: 22,
    minWidth: 130,
  },
});

export default ErrorState;
