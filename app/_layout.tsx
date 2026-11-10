import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { iniciarBanco } from '../src/database/registros';
import { theme } from '../src/theme';
import { iniciarTabelaAvaliacoes } from '../src/database/avaliacoes';

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="conecta-acesso.db"
      onInit={async (db) => {
  await iniciarBanco(db);
  await iniciarTabelaAvaliacoes(db);
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
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
        
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Conecta Acesso' }}
        />

        <Stack.Screen
          name="registrar"
          options={{ title: 'Registrar barreira' }}
        />

        <Stack.Screen
          name="registro/[id]"
          options={{ title: 'Detalhe do registro' }}
        />

        <Stack.Screen
          name="avaliar"
          options={{ title: 'Avaliação preliminar' }}
        />
      </Stack>
    </SQLiteProvider>
  );
}