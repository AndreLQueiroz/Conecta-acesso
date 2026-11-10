import {
  useCallback,
  useEffect,
  useRef,
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

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import { useSQLiteContext } from 'expo-sqlite';

import {
  Body,
  Button,
  Card,
  ErrorMessage,
  Screen,
  Title,
} from '../../src/components/ui';

import {
  atualizarStatusRegistro,
  buscarRegistro,
  excluirRegistro,
} from '../../src/database/registros';

import { consultarParceiros } from '../../src/services/parceiros';
import { theme } from '../../src/theme';

import {
  STATUS_REGISTRO,
  type Parceiro,
  type Registro,
  type StatusRegistro,
} from '../../src/types';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const operacaoEmAndamento = useRef(false);

  const [registro, setRegistro] = useState<Registro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [statusSelecionado, setStatusSelecionado] =
    useState<StatusRegistro>('Registrado');

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erroFoto, setErroFoto] = useState(false);

  const [confirmarExclusao, setConfirmarExclusao] =
    useState(false);

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loadingParceiros, setLoadingParceiros] = useState(false);
  const [erroParceiros, setErroParceiros] = useState('');

  const carregarRegistro = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      const registroId = Number(id);

      if (!Number.isInteger(registroId) || registroId <= 0) {
        setRegistro(null);
        return;
      }

      const resultado = await buscarRegistro(db, registroId);

      setRegistro(resultado);
      setErroFoto(false);

      if (resultado) {
        setStatusSelecionado(resultado.status);
      }
    } catch {
      setErro('Não foi possível carregar este registro.');
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  useFocusEffect(
    useCallback(() => {
      void carregarRegistro();
    }, [carregarRegistro]),
  );

  const categoria = registro?.categoria;

  const carregarParceiros = useCallback(async () => {
    if (!categoria) return;

    setLoadingParceiros(true);
    setErroParceiros('');

    try {
      const resultado = await consultarParceiros(categoria);
      setParceiros(resultado);
    } catch {
      setErroParceiros(
        'Não foi possível consultar os parceiros.',
      );
    } finally {
      setLoadingParceiros(false);
    }
  }, [categoria]);

  useEffect(() => {
    void carregarParceiros();
  }, [carregarParceiros]);

  async function salvarStatus() {
    if (!registro || operacaoEmAndamento.current) return;

    operacaoEmAndamento.current = true;
    setSalvando(true);
    setErro('');
    setMensagem('');

    try {
      await atualizarStatusRegistro(
        db,
        registro.id,
        statusSelecionado,
      );

      setRegistro((atual) =>
        atual
          ? { ...atual, status: statusSelecionado }
          : null,
      );

      setMensagem('Status de demonstração salvo.');
    } catch {
      setErro('Não foi possível atualizar o status.');
    } finally {
      operacaoEmAndamento.current = false;
      setSalvando(false);
    }
  }

  async function removerRegistro() {
    if (!registro || operacaoEmAndamento.current) return;

    operacaoEmAndamento.current = true;
    setSalvando(true);
    setErro('');
    setMensagem('');

    try {
      await excluirRegistro(db, registro.id);
      router.replace('/');
    } catch {
      setErro('Não foi possível excluir o registro.');
    } finally {
      operacaoEmAndamento.current = false;
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator
          accessibilityLabel="Carregando registro"
          color={theme.colors.primary}
        />
      </Screen>
    );
  }

  if (!registro) {
    return (
      <Screen>
        <Title>
          {erro ? 'Falha ao carregar' : 'Registro não encontrado'}
        </Title>

        {erro ? (
          <>
            <ErrorMessage message={erro} />

            <Button
              title="Tentar novamente"
              onPress={() => void carregarRegistro()}
            />
          </>
        ) : null}

        <Button
          title="Voltar ao início"
          onPress={() => router.replace('/')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>{registro.estabelecimento}</Title>

      <Card>
        <Text style={styles.status}>
          Status: {registro.status}
        </Text>

        <Body>Local: {registro.localizacao}</Body>
        <Body>Categoria: {registro.categoria}</Body>
        <Body>{registro.descricao}</Body>

        <Body>
          Registrado em{' '}
          {new Date(registro.criadoEm).toLocaleString('pt-BR')}
        </Body>
      </Card>

      {registro.foto ? (
        <Card>
          <Text
            accessibilityRole="header"
            style={styles.heading}
          >
            Foto do relato
          </Text>

          <Image
            source={{ uri: registro.foto }}
            accessibilityLabel={
              `Foto da barreira relatada em ${registro.estabelecimento}`
            }
            resizeMode="contain"
            style={styles.photo}
            onError={() => setErroFoto(true)}
          />

          {erroFoto ? (
            <ErrorMessage message="Não foi possível exibir a foto deste registro." />
          ) : null}
        </Card>
      ) : null}

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Avaliação preliminar
        </Text>

        <Body>
          Complemente o relato com informações sobre entrada,
          circulação, atendimento e sinalização.
        </Body>

        <Button
          title="Abrir questionário do estabelecimento"
          disabled={salvando}
          onPress={() =>
            router.push({
              pathname: '/avaliar',
              params: { id: String(registro.id) },
            })
          }
        />
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Acompanhamento de demonstração
        </Text>

        <Body>
          Altere o status para simular o acompanhamento.
          Esta ação é salva apenas neste dispositivo e não
          representa uma resposta do estabelecimento.
        </Body>

        <View style={styles.options}>
          {STATUS_REGISTRO.map((status) => {
            const selecionado = statusSelecionado === status;

            return (
              <Pressable
                key={status}
                accessibilityRole="radio"
                accessibilityLabel={`Status: ${status}`}
                accessibilityState={{
                  checked: selecionado,
                  disabled: salvando,
                }}
                disabled={salvando}
                onPress={() => {
                  setStatusSelecionado(status);
                  setMensagem('');
                }}
                style={[
                  styles.option,
                  selecionado && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selecionado && styles.selectedText,
                  ]}
                >
                  {selecionado ? '✓ ' : ''}
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          title="Salvar status simulado"
          loading={salvando}
          disabled={statusSelecionado === registro.status}
          onPress={() => void salvarStatus()}
        />

        {mensagem ? (
          <Text
            accessibilityLiveRegion="polite"
            style={styles.feedback}
          >
            {mensagem}
          </Text>
        ) : null}
      </Card>

      <Text accessibilityRole="header" style={styles.heading}>
        Parceiros sugeridos
      </Text>

      <Body>
        Exemplos fictícios relacionados à categoria.
        Não há contratação ou encaminhamento real.
      </Body>

      {loadingParceiros ? (
        <ActivityIndicator
          accessibilityLabel="Consultando parceiros"
          color={theme.colors.primary}
        />
      ) : erroParceiros ? (
        <Card>
          <ErrorMessage message={erroParceiros} />

          <Button
            title="Tentar consultar novamente"
            onPress={() => void carregarParceiros()}
          />
        </Card>
      ) : parceiros.length === 0 ? (
        <Card>
          <Body>
            Ainda não há parceiros de demonstração para
            esta categoria.
          </Body>
        </Card>
      ) : (
        parceiros.map((parceiro) => (
          <Card key={parceiro.id}>
            <Text style={styles.partnerName}>
              {parceiro.nome}
            </Text>

            <Body>{parceiro.especialidade}</Body>
          </Card>
        ))
      )}

      {erro ? <ErrorMessage message={erro} /> : null}

      {confirmarExclusao ? (
        <Card>
          <Text accessibilityRole="header" style={styles.heading}>
            Excluir este registro?
          </Text>

          <Body>
            O registro, sua foto e o questionário associado
            serão removidos do banco local.
            Esta ação não pode ser desfeita.
          </Body>

          <Button
            title="Confirmar exclusão"
            loading={salvando}
            onPress={() => void removerRegistro()}
          />

          <Button
            title="Cancelar exclusão"
            secondary
            disabled={salvando}
            onPress={() => setConfirmarExclusao(false)}
          />
        </Card>
      ) : (
        <Button
          title="Excluir registro"
          secondary
          disabled={salvando}
          onPress={() => setConfirmarExclusao(true)}
        />
      )}

      <Button
        title="Voltar aos meus registros"
        secondary
        disabled={salvando}
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

  status: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  photo: {
    width: '100%',
    height: theme.sizes.photoHeight,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background,
  },

  options: {
    gap: theme.spacing.sm,
  },

  option: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
  },

  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  optionText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },

  selectedText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  feedback: {
    fontSize: theme.fontSize.body,
    color: theme.colors.primary,
  },

  partnerName: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
});