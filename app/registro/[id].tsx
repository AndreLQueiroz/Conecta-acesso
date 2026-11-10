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

import { Ionicons } from '@expo/vector-icons';

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
  StatusBadge,
  Title,
} from '../../src/components/ui';

import {
  atualizarStatusRegistro,
  buscarRegistro,
  excluirRegistro,
  listarHistoricoRegistro,
  type EventoRegistro,
} from '../../src/database/registros';

import {
  buscarAvaliacao,
} from '../../src/database/avaliacoes';

import {
  gerarTriagem,
} from '../../src/services/avaliacao';

import {
  consultarParceiros,
} from '../../src/services/parceiros';

import { theme } from '../../src/theme';

import {
  STATUS_REGISTRO,
  type Avaliacao,
  type Parceiro,
  type Registro,
  type StatusRegistro,
} from '../../src/types';

const EXPLICACOES_STATUS: Record<StatusRegistro, string> = {
  Registrado:
    'O relato foi salvo. Você pode complementar as informações com o questionário.',

  'Em análise':
    'Na simulação, as informações estão sendo analisadas. Isso não representa avaliação técnica real.',

  'Em melhoria':
    'Na simulação, existem melhorias em andamento. Nenhuma execução de obra é confirmada pelo aplicativo.',

  'Melhoria informada':
    'Na simulação, uma melhoria foi informada. Esse status não certifica acessibilidade nem confirma sua resolução.',
};

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const bloqueio = useRef(false);

  const [registro, setRegistro] = useState<Registro | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(
    null,
  );

  const [historico, setHistorico] = useState<EventoRegistro[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [erroHistorico, setErroHistorico] = useState('');

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

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    setErroHistorico('');

    try {
      const registroId = Number(id);

      if (!Number.isInteger(registroId) || registroId <= 0) {
        setRegistro(null);
        return;
      }

      const [
        registroEncontrado,
        avaliacaoEncontrada,
        eventosEncontrados,
      ] = await Promise.all([
        buscarRegistro(db, registroId),
        buscarAvaliacao(db, registroId),
        listarHistoricoRegistro(db, registroId),
      ]);

      setRegistro(registroEncontrado);
      setAvaliacao(avaliacaoEncontrada);
      setHistorico(eventosEncontrados);
      setErroFoto(false);

      if (registroEncontrado) {
        setStatusSelecionado(registroEncontrado.status);
      }
    } catch {
      setErro('Não foi possível carregar o acompanhamento.');
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  useFocusEffect(
    useCallback(() => {
      setMensagem('');
      setConfirmarExclusao(false);
      void carregar();
    }, [carregar]),
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

  async function atualizarHistorico(registroId: number) {
    setErroHistorico('');

    try {
      const eventos = await listarHistoricoRegistro(
        db,
        registroId,
      );

      setHistorico(eventos);
    } catch {
      setErroHistorico(
        'Não foi possível atualizar a linha do tempo. Tente novamente.',
      );
    }
  }

  async function salvarStatus() {
    if (!registro || bloqueio.current) return;
    if (statusSelecionado === registro.status) return;

    bloqueio.current = true;
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

      setMensagem(
        'Status simulado salvo. A mudança foi registrada no histórico.',
      );

      await atualizarHistorico(registro.id);
    } catch {
      setErro('Não foi possível atualizar o status.');
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  async function removerRegistro() {
    if (!registro || bloqueio.current) return;

    bloqueio.current = true;
    setSalvando(true);
    setErro('');

    try {
      await excluirRegistro(db, registro.id);
      router.replace('/registros');
    } catch {
      setErro('Não foi possível excluir o registro.');
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  function abrirQuestionario() {
    if (!registro) return;

    router.push({
      pathname: '/avaliar',
      params: { id: String(registro.id) },
    });
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator
          accessibilityLabel="Carregando acompanhamento"
          color={theme.colors.primary}
        />

        <Body>Organizando as informações do relato…</Body>
      </Screen>
    );
  }

  if (!registro || erro && !registro) {
    return (
      <Screen>
        <Title>
          {erro ? 'Não conseguimos abrir o relato' : 'Relato não encontrado'}
        </Title>

        {erro ? (
          <>
            <ErrorMessage message={erro} />

            <Button
              title="Tentar novamente"
              onPress={() => void carregar()}
            />
          </>
        ) : (
          <Body>
            O registro pode ter sido excluído deste dispositivo.
          </Body>
        )}

        <Button
          title="Ir para meus registros"
          secondary
          onPress={() => router.replace('/registros')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          RELATO #{registro.id}
        </Text>

        <Title>{registro.estabelecimento}</Title>

        <StatusBadge status={registro.status} />

        <Body>{EXPLICACOES_STATUS[registro.status]}</Body>
      </View>

      {erro ? <ErrorMessage message={erro} /> : null}

      {registro.foto ? (
        <Card>
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
            <ErrorMessage message="Não foi possível exibir a foto deste relato." />
          ) : null}
        </Card>
      ) : null}

      <Card>
        <View style={styles.sectionHeading}>
          <Ionicons
            name="document-text-outline"
            size={theme.sizes.icon}
            color={theme.colors.primary}
            accessible={false}
          />

          <Text accessibilityRole="header" style={styles.heading}>
            Informações do relato
          </Text>
        </View>

        <Text style={styles.label}>LOCALIZAÇÃO</Text>
        <Body>{registro.localizacao}</Body>

        <Text style={styles.label}>CATEGORIA</Text>
        <Body>{registro.categoria}</Body>

        <Text style={styles.label}>DIFICULDADE RELATADA</Text>
        <Body>{registro.descricao}</Body>

        <Text style={styles.date}>
          Criado em{' '}
          {new Date(registro.criadoEm).toLocaleString('pt-BR')}
        </Text>
      </Card>

      <View style={styles.nextStep}>
        <Ionicons
          name={
            avaliacao
              ? 'checkmark-circle-outline'
              : 'clipboard-outline'
          }
          size={theme.sizes.largeIcon}
          color={theme.colors.primary}
          accessible={false}
        />

        <Text accessibilityRole="header" style={styles.heading}>
          {avaliacao
            ? 'Informações complementadas'
            : 'Próximo passo: completar o questionário'}
        </Text>

        <Body>
          {avaliacao
            ? 'O questionário está salvo. Confira as observações abaixo e consulte as especialidades relacionadas.'
            : 'Acrescente observações sobre entrada, circulação, atendimento e sinalização para organizar a triagem.'}
        </Body>

        <Button
          title={
            avaliacao
              ? 'Revisar questionário'
              : 'Preencher avaliação preliminar'
          }
          disabled={salvando}
          onPress={abrirQuestionario}
        />
      </View>

      {avaliacao ? (
        <Card>
          <View style={styles.sectionHeading}>
            <Ionicons
              name="clipboard-outline"
              size={theme.sizes.icon}
              color={theme.colors.primary}
              accessible={false}
            />

            <Text accessibilityRole="header" style={styles.heading}>
              Resumo da avaliação
            </Text>
          </View>

          <Body>Entrada: {avaliacao.entrada}</Body>
          <Body>Circulação: {avaliacao.circulacao}</Body>
          <Body>Atendimento: {avaliacao.atendimento}</Body>
          <Body>Sinalização: {avaliacao.sinalizacao}</Body>

          {avaliacao.larguraEntrada ? (
            <Body>
              Largura livre informada: {avaliacao.larguraEntrada} cm
            </Body>
          ) : null}

          {avaliacao.observacoes ? (
            <Body>
              Observações: {avaliacao.observacoes}
            </Body>
          ) : null}

          <Text style={styles.date}>
            Atualizado em{' '}
            {new Date(
              avaliacao.atualizadoEm,
            ).toLocaleString('pt-BR')}
          </Text>

          <Text accessibilityRole="header" style={styles.heading}>
            Pontos para atenção
          </Text>

          {gerarTriagem(avaliacao).map((orientacao) => (
            <View key={orientacao} style={styles.observation}>
              <Ionicons
                name="information-circle-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
                accessible={false}
              />

              <Text style={styles.observationText}>
                {orientacao}
              </Text>
            </View>
          ))}

          <Body>
            Respostas declaradas. Esta triagem não certifica
            acessibilidade nem substitui avaliação técnica.
          </Body>
        </Card>
      ) : null}

      <Text accessibilityRole="header" style={styles.heading}>
        Linha do tempo
      </Text>

      <Body>
        Histórico salvo neste dispositivo.
        As alterações de status são simulações acadêmicas.
      </Body>

      {erroHistorico ? (
        <Card>
          <ErrorMessage message={erroHistorico} />

          <Button
            title="Atualizar linha do tempo"
            secondary
            onPress={() =>
              void atualizarHistorico(registro.id)
            }
          />
        </Card>
      ) : null}

      {historico.length === 0 ? (
        <Card>
          <Body>
            Ainda não há eventos disponíveis para este relato.
          </Body>
        </Card>
      ) : (
        <Card>
          {historico.map((evento, indice) => (
            <View key={evento.id} style={styles.timelineItem}>
              <View style={styles.timelineRail}>
                <View
                  style={[
                    styles.timelineDot,
                    indice === 0 && styles.latestDot,
                  ]}
                />

                {indice < historico.length - 1 ? (
                  <View style={styles.timelineLine} />
                ) : null}
              </View>

              <View style={styles.timelineContent}>
                {indice === 0 ? (
                  <Text style={styles.latestLabel}>
                    MAIS RECENTE
                  </Text>
                ) : null}

                <Text style={styles.eventTitle}>
                  {evento.titulo}
                </Text>

                <Text style={styles.date}>
                  {new Date(
                    evento.criadoEm,
                  ).toLocaleString('pt-BR')}
                </Text>

                <Body>{evento.descricao}</Body>
              </View>
            </View>
          ))}
        </Card>
      )}

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Simular atualização
        </Text>

        <Body>
          Este controle demonstra o acompanhamento.
          Nenhum estabelecimento ou profissional é notificado.
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
          title="Salvar atualização simulada"
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
            Ainda não há parceiros de demonstração
            para esta categoria.
          </Body>
        </Card>
      ) : (
        parceiros.map((parceiro) => (
          <Card key={parceiro.id}>
            <Text style={styles.label}>
              EXEMPLO FICTÍCIO
            </Text>

            <Text style={styles.heading}>
              {parceiro.nome}
            </Text>

            <Body>{parceiro.especialidade}</Body>
          </Card>
        ))
      )}

      {confirmarExclusao ? (
        <Card>
          <Text accessibilityRole="header" style={styles.heading}>
            Excluir este relato?
          </Text>

          <Body>
            O registro, a foto, o questionário associado
            e a linha do tempo serão removidos do banco local.
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
          title="Excluir relato"
          secondary
          disabled={salvando}
          onPress={() => setConfirmarExclusao(true)}
        />
      )}

      <Button
        title="Voltar aos meus registros"
        secondary
        disabled={salvando}
        onPress={() => router.replace('/registros')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },

  eyebrow: {
    fontSize: theme.fontSize.small,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  heading: {
    flexShrink: 1,
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  label: {
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

  nextStep: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.primaryLight,
  },

  observation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },

  observationText: {
    flex: 1,
    fontSize: theme.fontSize.body,
    lineHeight: theme.fontSize.body * 1.5,
    color: theme.colors.muted,
  },

  timelineItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  timelineRail: {
    alignItems: 'center',
    width: theme.spacing.md,
  },

  timelineDot: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },

  latestDot: {
    backgroundColor: theme.colors.primary,
  },

  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: theme.colors.border,
  },

  timelineContent: {
    flex: 1,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },

  latestLabel: {
    fontSize: theme.fontSize.small,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  eventTitle: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: theme.colors.text,
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
});