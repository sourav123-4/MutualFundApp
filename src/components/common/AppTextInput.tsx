import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Colors, Radius, Fonts } from '../../themes';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

const AppTextInput = forwardRef<TextInput, Props>(
  ({ label, error, style, ...props }, ref) => (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={Colors.textSecondary}
        selectionColor={Colors.primary}
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  ),
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 7,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: 12,
  },
});

AppTextInput.displayName = 'AppTextInput';

export default AppTextInput;
