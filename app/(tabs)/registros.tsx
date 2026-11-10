import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';

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
} from '../../src/components/ui';

import { listarRegistros } from '../../src/database/registros';

import { theme } from '../../src/theme';
import type { Registro } from '../../src/types';

export default function RegistrosScreen() {
  const db = useSQLiteContext();

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      const resultado = await listarRegistros(db);
      setRegistros(resultado);
    } catch {
      setErro('Não foi possível carregar seus registros.');
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
    const texto = [
      registro.estabelecimento,
      registro.localizacao,
      registro.categoria,
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR');

    return texto.includes(termo);
  });

  return (
    <Screen>
      <Title>Meus registros</Title>

      <Body>
        Consulte seus relatos e acompanhe os status
        de demonstração.
      </Body>

      <Button
        title="Registrar nova barreira"
        onPress={() => router.push('/registrar')}
      />

      <Field
        label="Buscar registros"
        placeholder="Estabelecimento, local ou categoria"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

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
          <Text style={styles.heading}>
            {registros.length === 0
              ? 'Seu primeiro relato começa aqui'
              : 'Nenhum resultado encontrado'}
          </Text>

          <Body>
            {registros.length === 0
              ? 'Você ainda não salvou nenhum registro neste dispositivo.'
              : 'Tente buscar por outro nome, local ou categoria.'}
          </Body>

          {registros.length > 0 ? (
            <Button
              title="Limpar busca"
              secondary
              onPress={() => setBusca('')}
            />
          ) : null}
        </Card>
      ) : (
        filtrados.map((registro) => (
          <Card key={registro.id}>
            <StatusBadge status={registro.status} />

            <Text style={styles.heading}>
              {registro.estabelecimento}
            </Text>

            <Body>Categoria: {registro.categoria}</Body>
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
        ))
      )}

      <Button
        title="Voltar ao início"
        secondary
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  date: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
  },
});