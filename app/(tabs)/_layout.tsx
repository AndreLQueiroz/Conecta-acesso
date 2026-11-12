import type { ComponentProps } from 'react';

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../src/theme';

import { useState } from 'react';

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type NomeIcone =
  ComponentProps<typeof Ionicons>['name'];

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

export default function TabsLayout() {
  return (
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

        tabBarInactiveTintColor:
          theme.colors.tabInactive,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          minHeight: theme.sizes.tabBarHeight,
          paddingTop: theme.spacing.sm,
        },

        tabBarLabelStyle: {
          fontSize: theme.fontSize.small,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color, size }) => {
          const configuracao = icones[route.name];

          return (
            <Ionicons
              name={
                configuracao
                  ? focused
                    ? configuracao.ativo
                    : configuracao.inativo
                  : 'ellipse-outline'
              }
              size={size}
              color={color ?? theme.colors.primary}
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
          title: 'Explorar possibilidades',
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
    </Tabs>
  );
}