import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Image,
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
  Field,
  Screen,
  StatusBadge,
  Title,
} from '../src/components/ui';

import { listarRegistros } from '../src/database/registros';
import { theme } from '../src/theme';

import {
  STATUS_REGISTRO,
  type Registro,
} from '../src/types';

export default function RegistrosScreen() {
  const db = useSQLiteContext();

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      setRegistros(await listarRegistros(db));
    } catch {
      setErro('Não foi possível carregar os registros.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const termo = busca.trim().toLocaleLowerCase('pt-BR');

  const filtrados = registros.filter((registro) => {
    const correspondeStatus =
      filtro === 'Todos' || registro.status === filtro;

    const texto = [
      registro.estabelecimento,
      registro.localizacao,
      registro.categoria,
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR');

    return correspondeStatus && texto.includes(termo);
  });

  return (
    <Screen>
      <Title>Seus relatos, em um só lugar.</Title>

      <Body>
        Consulte o que você registrou e acompanhe
        os status de demonstração.
      </Body>

      <Button
        title="Registrar nova barreira"
        onPress={() => router.push('/registrar')}
      />

      <Field
        label="Buscar registros"
        placeholder="Estabelecimento, localização ou categoria"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

      <View style={styles.filters}>
        {['Todos', ...STATUS_REGISTRO].map((item) => {
          const selecionado = filtro === item;

          return (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityLabel={`Filtrar: ${item}`}
              accessibilityState={{ checked: selecionado }}
              onPress={() => setFiltro(item)}
              style={[
                styles.filter,
                selecionado && styles.selectedFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selecionado && styles.selectedFilterText,
                ]}
              >
                {selecionado ? '✓ ' : ''}
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Carregando registros"
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
      ) : filtrados.length === 0 ? (
        <Card>
          <Ionicons
            name="search-outline"
            size={theme.sizes.largeIcon}
            color={theme.colors.primary}
            accessible={false}
          />

          <Text style={styles.name}>
            {registros.length
              ? 'Nenhum resultado encontrado'
              : 'Seu histórico começa com o primeiro relato'}
          </Text>

          <Body>
            {registros.length
              ? 'Tente outro termo ou remova os filtros.'
              : 'Registre uma barreira fictícia para experimentar a jornada.'}
          </Body>

          {registros.length ? (
            <Button
              title="Limpar busca e filtros"
              secondary
              onPress={() => {
                setBusca('');
                setFiltro('Todos');
              }}
            />
          ) : (
            <Button
              title="Criar primeiro registro"
              onPress={() => router.push('/registrar')}
            />
          )}
        </Card>
      ) : (
        <>
          <Body>
            {filtrados.length} registro(s) encontrado(s)
          </Body>

          {filtrados.map((registro) => (
            <Card key={registro.id}>
              {registro.foto ? (
                <Image
                  source={{ uri: registro.foto }}
                  accessibilityLabel={
                    `Foto do relato de ${registro.estabelecimento}`
                  }
                  resizeMode="cover"
                  style={styles.photo}
                />
              ) : null}

              <StatusBadge status={registro.status} />

              <Text style={styles.name}>
                {registro.estabelecimento}
              </Text>

              <Text style={styles.category}>
                {registro.categoria}
              </Text>

              <Body>{registro.localizacao}</Body>

              <Body>{registro.descricao}</Body>

              <Text style={styles.date}>
                Registrado em{' '}
                {new Date(
                  registro.criadoEm,
                ).toLocaleDateString('pt-BR')}
              </Text>

              <Button
                title={`Abrir relato: ${registro.estabelecimento}`}
                secondary
                onPress={() =>
                  router.push({
                    pathname: '/registro/[id]',
                    params: { id: String(registro.id) },
                  })
                }
              />
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  filter: {
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
  },

  selectedFilter: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },

  filterText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
  },

  selectedFilterText: {
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },

  name: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },

  category: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  date: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
  },

  photo: {
    width: '100%',
    height: theme.sizes.photoHeight,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background,
  },
});