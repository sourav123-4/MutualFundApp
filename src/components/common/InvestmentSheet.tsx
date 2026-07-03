import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Fonts } from '../../themes';
import { validateInvestmentAmount } from '../../utils/validation';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';

type Props = {
  visible: boolean;
  schemeName: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

const InvestmentSheet = ({
  visible,
  schemeName,
  onClose,
  onConfirm,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (visible) {
      setAmount('');
      setError(undefined);
    }
  }, [visible]);

  const submit = () => {
    const validationError = validateInvestmentAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }
    onConfirm(Number(amount));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close investment form"
          style={styles.overlay}
          onPress={onClose}
        />
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
        >
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}>
              <Text style={styles.title}>Start investing</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {schemeName}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}
              style={styles.close}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <AppTextInput
            label="Investment amount"
            value={amount}
            onChangeText={value => {
              setAmount(value.replace(/[^0-9]/g, ''));
              setError(undefined);
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            placeholder="Minimum Rs. 100"
            error={error}
            onSubmitEditing={submit}
          />
          <Text style={styles.helper}>This is a simulated investment.</Text>
          <AppButton title="Done" onPress={submit} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: 22,
    paddingTop: 10,
    gap: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleCopy: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: Fonts.extraBold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  closeText: {
    color: Colors.textSecondary,
    fontSize: 26,
    lineHeight: 28,
  },
  helper: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: -8,
    fontFamily: Fonts.regular,
  },
});

export default InvestmentSheet;
