import { useState } from 'react';

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Stack } from 'expo-router';

import {
  SQLiteProvider,
  type SQLiteDatabase,
} from 'expo-sqlite';

import { StatusBar } from 'expo-status-bar';

import { iniciarBanco } from '../src/database/registros';

import {
  iniciarTabelaAvaliacoes,
} from '../src/database/avaliacoes';

import { theme } from '../src/theme';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

async function prepararBanco(db: SQLiteDatabase) {
  await iniciarBanco(db);
  await iniciarTabelaAvaliacoes(db);
}

export default function RootLayout() {
  const [erroBanco, setErroBanco] = useState('');
  const [tentativaBanco, setTentativaBanco] = useState(0);

  function tentarAbrirBanco() {
    if (Platform.OS === 'web') {
      globalThis.location.reload();
      return;
    }

    setErroBanco('');
    setTentativaBanco((atual) => atual + 1);
  }

  if (erroBanco) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.card}>
          <Text
            accessibilityRole="header"
            style={styles.title}
          >
            Não conseguimos abrir seus registros
          </Text>

          <Text
            accessibilityRole="alert"
            style={styles.description}
          >
            {Platform.OS === 'web'
              ? 'O banco pode estar em uso em outra aba. Feche as outras abas deste aplicativo e tente novamente.'
              : 'Não foi possível acessar o banco local. Tente abrir novamente.'}
          </Text>

          <Text style={styles.description}>
            Esta mensagem não significa que seus registros
            foram apagados.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar abrir os registros novamente"
            onPress={tentarAbrirBanco}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SQLiteProvider
      key={tentativaBanco}
      databaseName="conecta-acesso.db"
      onInit={prepararBanco}
      onError={(erro) => {
        console.error('Falha ao abrir o banco local:', erro);
        setErroBanco(
          erro.message || 'Não foi possível abrir o banco.',
        );
      }}
    >
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },

          headerTintColor: theme.colors.primary,

          headerTitleStyle: {
            fontSize: theme.fontSize.subtitle,
            fontWeight: '700',
          },

          headerShadowVisible: false,

          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="registrar"
          options={{
            title: 'Registrar barreira',
          }}
        />

        <Stack.Screen
          name="avaliar"
          options={{
            title: 'Avaliação preliminar',
          }}
        />

        <Stack.Screen
          name="registro/[id]"
          options={{
            title: 'Detalhe do relato',
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  card: {
    width: '100%',
    maxWidth: theme.sizes.contentMaxWidth,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
  },

  description: {
    fontSize: theme.fontSize.body,
    lineHeight: theme.fontSize.body * 1.5,
    color: theme.colors.muted,
  },

  button: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.primary,
  },

  buttonText: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: theme.colors.onPrimary,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.7,
  },
}); 