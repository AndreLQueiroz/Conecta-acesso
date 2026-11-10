import type { ReactNode } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../theme';

export function Screen({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Title({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Text accessibilityRole="header" style={styles.title}>
      {children}
    </Text>
  );
}

export function Body({
  children,
}: {
  children: ReactNode;
}) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Card({
  children,
}: {
  children: ReactNode;
}) {
  return <View style={styles.card}>{children}</View>;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  secondary?: boolean;
}) {
  const indisponivel = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: indisponivel,
        busy: loading,
      }}
      disabled={indisponivel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        (pressed || indisponivel) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            secondary
              ? theme.colors.primary
              : theme.colors.onPrimary
          }
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            secondary && styles.secondaryButtonText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & {
  label: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.muted}
        style={[
          styles.input,
          props.multiline && styles.multiline,
          props.style,
        ]}
      />
    </View>
  );
}

export function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <View style={styles.errorBox}>
      <Text
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={styles.error}
      >
        {message}
      </Text>
    </View>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const variant =
    status === 'Melhoria informada'
      ? styles.statusSuccess
      : status === 'Em melhoria'
        ? styles.statusWarning
        : styles.statusDefault;

  const textVariant =
    status === 'Melhoria informada'
      ? styles.statusSuccessText
      : status === 'Em melhoria'
        ? styles.statusWarningText
        : styles.statusDefaultText;

  return (
    <View style={[styles.statusBadge, variant]}>
      <Text style={[styles.statusText, textVariant]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    width: '100%',
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
  },

  body: {
    fontSize: theme.fontSize.body,
    color: theme.colors.muted,
    lineHeight: theme.fontSize.body * 1.5,
  },

  card: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },

  button: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    borderRadius: theme.radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },

  secondaryButton: {
    backgroundColor: theme.colors.primaryLight,
  },

  buttonText: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: theme.colors.onPrimary,
    textAlign: 'center',
  },

  secondaryButtonText: {
    color: theme.colors.primary,
  },

  dimmed: {
    opacity: 0.6,
  },

  field: {
    gap: theme.spacing.sm,
  },

  label: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },

  input: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
  },

  multiline: {
    minHeight: theme.sizes.description,
    textAlignVertical: 'top',
  },

  errorBox: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.dangerLight,
  },

  error: {
    fontSize: theme.fontSize.body,
    color: theme.colors.danger,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },

  statusText: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
  },

  statusDefault: {
    backgroundColor: theme.colors.primaryLight,
  },

  statusDefaultText: {
    color: theme.colors.primary,
  },

  statusSuccess: {
    backgroundColor: theme.colors.successLight,
  },

  statusSuccessText: {
    color: theme.colors.success,
  },

  statusWarning: {
    backgroundColor: theme.colors.warningLight,
  },

  statusWarningText: {
    color: theme.colors.warning,
  },
});