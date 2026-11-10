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

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <Text accessibilityRole="header" style={styles.title}>
      {children}
    </Text>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Card({ children }: { children: ReactNode }) {
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
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: unavailable,
        busy: loading,
      }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        (pressed || unavailable) && styles.dimmed,
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
}: TextInputProps & { label: string }) {
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

export function ErrorMessage({ message }: { message: string }) {
  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.error}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '700',
    color: theme.colors.text,
  },

  body: {
    fontSize: theme.fontSize.body,
    color: theme.colors.muted,
  },

  card: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
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

  error: {
    fontSize: theme.fontSize.body,
    color: theme.colors.danger,
  },
});