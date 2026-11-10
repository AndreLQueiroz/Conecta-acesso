import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import {
  Body,
  Button,
  Card,
  ErrorMessage,
  Screen,
  Title,
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
      const dados = await listarRegistros(db);
      setRegistros(dados);
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

  return (
    <Screen>
      <Title>Acesso começa com informação</Title>

      <Body>
        Registre dificuldades de acessibilidade e consulte
        informações sobre possíveis encaminhamentos.
      </Body>

      <Card>
        <Body>
          Versão acadêmica: utilize estabelecimentos e situações
          fictícias. Os registros ficam salvos neste aparelho.
        </Body>
      </Card>

      <Button
        title="Registrar barreira"
        onPress={() => router.push('/registrar')}
      />

      <Text accessibilityRole="header" style={styles.heading}>
        Meus registros
      </Text>

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
      ) : registros.length === 0 ? (
        <Card>
          <Body>
            Você ainda não registrou nenhuma barreira.
            Use o botão acima para começar.
          </Body>
        </Card>
      ) : (
        registros.map((registro) => (
          <Card key={registro.id}>
            <Text style={styles.name}>
              {registro.estabelecimento}
            </Text>

            <Body>Categoria: {registro.categoria}</Body>
            <Body>Status: {registro.status}</Body>

            <Body>
              {new Date(registro.criadoEm).toLocaleDateString(
                'pt-BR',
              )}
            </Body>

            <Button
              title={`Ver registro de ${registro.estabelecimento}`}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  name: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '600',
    color: theme.colors.text,
  },
});