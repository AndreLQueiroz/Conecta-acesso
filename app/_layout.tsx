import type { ComponentProps } from 'react';

import {
  Pressable,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router, Tabs } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { iniciarBanco } from '../src/database/registros';

import {
  iniciarTabelaAvaliacoes,
} from '../src/database/avaliacoes';

import { theme } from '../src/theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

const icones: Record<
  string,
  {
    ativo: NomeIcone;
    inativo: NomeIcone;
  }
> = {
  index: {
    ativo: 'home',
    inativo: 'home-outline',
  },

  explorar: {
    ativo: 'compass',
    inativo: 'compass-outline',
  },

  registros: {
    ativo: 'file-tray-full',
    inativo: 'file-tray-full-outline',
  },

  sobre: {
    ativo: 'information-circle',
    inativo: 'information-circle-outline',
  },
};

function Voltar() {
  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={voltar}
      style={styles.backButton}
    >
      <Ionicons
        name="arrow-back"
        size={theme.sizes.icon}
        color={theme.colors.primary}
        accessible={false}
      />
    </Pressable>
  );
}

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

      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },

          headerTintColor: theme.colors.primary,

          headerTitleStyle: {
            fontSize: theme.fontSize.subtitle,
            fontWeight: '700',
          },

          headerShadowVisible: false,

          tabBarActiveTintColor: theme.colors.primary,

          tabBarInactiveTintColor: theme.colors.tabInactive,

          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            minHeight: theme.sizes.tabBarHeight,
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.sm,
          },

          tabBarLabelStyle: {
            fontSize: theme.fontSize.small,
            fontWeight: '600',
          },

          tabBarHideOnKeyboard: true,

          tabBarIcon: ({ focused, color, size }) => {
            const configuracao = icones[route.name];

            if (!configuracao) return null;

            return (
              <Ionicons
                name={
                  focused
                    ? configuracao.ativo
                    : configuracao.inativo
                }
                size={size}
                color={color}
                accessible={false}
              />
            );
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Conecta Acesso',
            tabBarLabel: 'Início',
          }}
        />

        <Tabs.Screen
          name="explorar"
          options={{
            title: 'Explore possibilidades',
            tabBarLabel: 'Explorar',
          }}
        />

        <Tabs.Screen
          name="registros"
          options={{
            title: 'Meus registros',
            tabBarLabel: 'Registros',
          }}
        />

        <Tabs.Screen
          name="sobre"
          options={{
            title: 'Sobre o projeto',
            tabBarLabel: 'Sobre',
          }}
        />

        <Tabs.Screen
          name="registrar"
          options={{
            href: null,
            title: 'Registrar barreira',
            headerLeft: () => <Voltar />,
          }}
        />

        <Tabs.Screen
          name="registro/[id]"
          options={{
            href: null,
            title: 'Detalhe do registro',
            headerLeft: () => <Voltar />,
          }}
        />

        <Tabs.Screen
          name="avaliar"
          options={{
            href: null,
            title: 'Avaliação preliminar',
            headerLeft: () => <Voltar />,
          }}
        />
      </Tabs>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  backButton: {
    minWidth: theme.sizes.touchTarget,
    minHeight: theme.sizes.touchTarget,
    marginLeft: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});