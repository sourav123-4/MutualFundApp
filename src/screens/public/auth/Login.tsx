import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../../../components/common/AppButton';
import AppTextInput from '../../../components/common/AppTextInput';
import { useAuth } from '../../../context/AuthContext';
import { Colors, Radius, normalize, Fonts } from '../../../themes';
import { LoginErrors, validateLogin } from '../../../utils/validation';

const Login = () => {
  const passwordRef = useRef<TextInput>(null);
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const validationErrors = validateLogin(email, password);
    setErrors(validationErrors);
    setFormError('');

    if (Object.keys(validationErrors).length) {
      return;
    }

    try {
      setLoading(true);
      await signIn();
    } catch {
      setFormError('Secure login could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={48}
      >
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.brand}>Fundly</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>INVEST WITH CLARITY</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Explore mutual funds and track their latest NAV history.
          </Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="Email address"
            value={email}
            onChangeText={value => {
              setEmail(value);
              setErrors(current => ({ ...current, email: undefined }));
              setFormError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
            placeholder="you@example.com"
            error={errors.email}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <AppTextInput
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={value => {
              setPassword(value);
              setErrors(current => ({ ...current, password: undefined }));
              setFormError('');
            }}
            secureTextEntry
            textContentType="password"
            returnKeyType="done"
            placeholder="Enter your password"
            error={errors.password}
            onSubmitEditing={submit}
          />

          {formError ? (
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          <AppButton title="Sign in" onPress={submit} loading={loading} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: normalize(24),
    paddingTop: normalize(24),
    paddingBottom: normalize(28),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
  },
  logo: {
    width: normalize(38),
    height: normalize(38),
    borderRadius: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  logoText: {
    color: Colors.surface,
    fontFamily: Fonts.extraBold,
    fontSize: normalize(21),
  },
  brand: {
    color: Colors.primaryDark,
    fontSize: normalize(20),
    fontFamily: Fonts.extraBold,
  },
  hero: {
    marginTop: normalize(72),
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: normalize(12),
    fontFamily: Fonts.extraBold,
    letterSpacing: normalize(1.5),
  },
  title: {
    color: Colors.text,
    fontSize: normalize(36),
    lineHeight: normalize(43),
    fontFamily: Fonts.extraBold,
    marginTop: normalize(9),
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: normalize(16),
    lineHeight: normalize(24),
    fontFamily: Fonts.regular,
    marginTop: normalize(8),
    maxWidth: normalize(330),
  },
  form: {
    gap: normalize(18),
    marginTop: normalize(36),
  },
  formError: {
    padding: normalize(12),
    borderRadius: Radius.sm,
    backgroundColor: Colors.errorSoft,
    marginTop: normalize(-4),
  },
  formErrorText: {
    color: Colors.error,
    fontSize: normalize(13),
    lineHeight: normalize(19),
    fontFamily: Fonts.regular,
  },
});

export default Login;
