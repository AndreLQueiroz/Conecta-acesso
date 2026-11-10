import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import { useSQLiteContext } from 'expo-sqlite';

import {
  Body,
  Button,
  Card,
  ErrorMessage,
  Screen,
  StatusBadge,
} from '../src/components/ui';

import { listarRegistros } from '../src/database/registros';
import { theme } from '../src/theme';

import type { Registro } from '../src/types';

export default function HomeScreen() {
  const db = useSQLiteContext();

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      setRegistros(await listarRegistros(db));
    } catch {
      setErro('Não foi possível carregar seu acompanhamento.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const emAcompanhamento = registros.filter(
    (registro) =>
      registro.status === 'Em análise' ||
      registro.status === 'Em melhoria',
  ).length;

  const recentes = registros.slice(0, 3);

  return (
    <Screen>
      <View style={styles.intro}>
        <View style={styles.location}>
          <Ionicons
            name="location-outline"
            size={theme.sizes.icon}
            color={theme.colors.primary}
            accessible={false}
          />

          <Text style={styles.locationText}>
            Um bairro com mais possibilidades
          </Text>
        </View>

        <Text style={styles.welcome}>
          Seu olhar pode abrir caminhos.
        </Text>

        <Body>
          Registre dificuldades de acesso e acompanhe
          as informações em um só lugar.
        </Body>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons
            name="accessibility-outline"
            size={theme.sizes.largeIcon}
            color={theme.colors.accent}
            accessible={false}
          />
        </View>

        <Text accessibilityRole="header" style={styles.heroTitle}>
          O próximo acesso começa com um relato.
        </Text>

        <Text style={styles.heroDescription}>
          Encontrou uma barreira? Conte o que aconteceu
          e organize os próximos passos.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Registrar uma barreira de acessibilidade"
          onPress={() => router.push('/registrar')}
          style={({ pressed }) => [
            styles.heroButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.heroButtonText}>
            Registrar barreira
          </Text>

          <Ionicons
            name="arrow-forward"
            size={theme.sizes.icon}
            color={theme.colors.accentText}
            accessible={false}
          />
        </Pressable>
      </View>

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Seu acompanhamento
      </Text>

      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Carregando acompanhamento"
          color={theme.colors.primary}
        />
      ) : erro ? (
        <Card>
          <ErrorMessage message={erro} />

          <Button
            title="Tentar novamente"
            onPress={() => void carregar()}
          />
        </Card>
      ) : (
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Ionicons
              name="documents-outline"
              size={theme.sizes.icon}
              color={theme.colors.primary}
              accessible={false}
            />

            <Text style={styles.metricNumber}>
              {registros.length}
            </Text>

            <Text style={styles.metricLabel}>
              Registros salvos
            </Text>
          </View>

          <View style={styles.metric}>
            <Ionicons
              name="time-outline"
              size={theme.sizes.icon}
              color={theme.colors.primary}
              accessible={false}
            />

            <Text style={styles.metricNumber}>
              {emAcompanhamento}
            </Text>

            <Text style={styles.metricLabel}>
              Em acompanhamento simulado
            </Text>
          </View>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text
          accessibilityRole="header"
          style={styles.sectionTitle}
        >
          Registros recentes
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todos os registros"
          onPress={() => router.push('/registros')}
          style={styles.textButton}
        >
          <Text style={styles.link}>Ver todos</Text>
        </Pressable>
      </View>

      {!loading && !erro && recentes.length === 0 ? (
        <Card>
          <Ionicons
            name="create-outline"
            size={theme.sizes.largeIcon}
            color={theme.colors.primary}
            accessible={false}
          />

          <Text style={styles.cardTitle}>
            Seu primeiro relato começa aqui
          </Text>

          <Body>
            Registre uma situação fictícia para conhecer
            a jornada do aplicativo.
          </Body>

          <Button
            title="Criar primeiro registro"
            secondary
            onPress={() => router.push('/registrar')}
          />
        </Card>
      ) : null}

      {!loading && !erro
        ? recentes.map((registro) => (
            <Pressable
              key={registro.id}
              accessibilityRole="button"
              accessibilityLabel={
                `Abrir registro de ${registro.estabelecimento}. ` +
                `Categoria: ${registro.categoria}. ` +
                `Status: ${registro.status}.`
              }
              onPress={() =>
                router.push({
                  pathname: '/registro/[id]',
                  params: { id: String(registro.id) },
                })
              }
              style={({ pressed }) => [
                styles.recentCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.recentTop}>
                <View style={styles.recentIcon}>
                  <Ionicons
                    name="storefront-outline"
                    size={theme.sizes.icon}
                    color={theme.colors.primary}
                    accessible={false}
                  />
                </View>

                <View style={styles.recentContent}>
                  <Text style={styles.cardTitle}>
                    {registro.estabelecimento}
                  </Text>

                  <Text style={styles.smallText}>
                    {registro.categoria}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={theme.sizes.icon}
                  color={theme.colors.muted}
                  accessible={false}
                />
              </View>

              <StatusBadge status={registro.status} />
            </Pressable>
          ))
        : null}

      <Card>
        <Text accessibilityRole="header" style={styles.cardTitle}>
          Informação que conecta
        </Text>

        <Body>
          Conheça as categorias de barreiras e encontre
          exemplos de especialidades que podem ajudar.
        </Body>

        <Button
          title="Explorar possibilidades"
          secondary
          onPress={() => router.push('/explorar')}
        />
      </Card>

      <View style={styles.notice}>
        <Ionicons
          name="information-circle-outline"
          size={theme.sizes.icon}
          color={theme.colors.primary}
          accessible={false}
        />

        <Text style={styles.noticeText}>
          Protótipo acadêmico. Use dados fictícios.
          Os registros ficam neste dispositivo e os
          status são simulados.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  locationText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  welcome: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
  },

  hero: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.primary,
  },

  heroIcon: {
    alignSelf: 'flex-start',
    padding: theme.spacing.sm,
  },

  heroTitle: {
    fontSize: theme.fontSize.hero,
    fontWeight: '800',
    color: theme.colors.onPrimary,
  },

  heroDescription: {
    fontSize: theme.fontSize.body,
    lineHeight: theme.fontSize.body * 1.5,
    color: theme.colors.heroMuted,
  },

  heroButton: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.accent,
  },

  heroButtonText: {
    flex: 1,
    fontSize: theme.fontSize.body,
    fontWeight: '800',
    color: theme.colors.accentText,
  },

  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },

  metric: {
    flexGrow: 1,
    flexBasis: '40%',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surface,
  },

  metricNumber: {
    fontSize: theme.fontSize.metric,
    fontWeight: '800',
    color: theme.colors.text,
  },

  metricLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
  },

  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },

  textButton: {
    minHeight: theme.sizes.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },

  link: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  recentCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surface,
  },

  recentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  recentIcon: {
    width: theme.sizes.iconBox,
    height: theme.sizes.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.primaryLight,
  },

  recentContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  cardTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  smallText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
  },

  notice: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.primaryLight,
  },

  noticeText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    lineHeight: theme.fontSize.small * 1.5,
    color: theme.colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },
});