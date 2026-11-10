import { Stack } from 'expo-router';

import {
  SQLiteProvider,
  type SQLiteDatabase,
} from 'expo-sqlite';

import { StatusBar } from 'expo-status-bar';

import {
  iniciarBanco,
} from '../src/database/registros';

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
  return (
    <SQLiteProvider
      databaseName="conecta-acesso.db"
      onInit={prepararBanco}
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