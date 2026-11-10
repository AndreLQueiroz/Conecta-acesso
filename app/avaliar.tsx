import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import {
  Body,
  Button,
  Card,
  ErrorMessage,
  Field,
  Screen,
  Title,
} from '../src/components/ui';

import { buscarRegistro } from '../src/database/registros';

import {
  buscarAvaliacao,
  salvarAvaliacao,
} from '../src/database/avaliacoes';

import { gerarTriagem } from '../src/services/avaliacao';
import { theme } from '../src/theme';

import {
  RESPOSTAS_AVALIACAO,
  type Avaliacao,
  type Registro,
  type RespostaAvaliacao,
} from '../src/types';

type CampoPergunta =
  | 'entrada'
  | 'circulacao'
  | 'atendimento'
  | 'sinalizacao';

const perguntas: {
  campo: CampoPergunta;
  titulo: string;
}[] = [
  {
    campo: 'entrada',
    titulo:
      'Foi possível entrar sem dificuldade de acesso relatada?',
  },
  {
    campo: 'circulacao',
    titulo:
      'Foi possível circular sem obstáculos relatados?',
  },
  {
    campo: 'atendimento',
    titulo:
      'O atendimento ofereceu comunicação adequada à necessidade observada?',
  },
  {
    campo: 'sinalizacao',
    titulo:
      'Foi possível identificar os espaços pela sinalização?',
  },
];

function criarAvaliacao(registroId: number): Avaliacao {
  return {
    registroId,
    entrada: 'Não sei',
    circulacao: 'Não sei',
    atendimento: 'Não sei',
    sinalizacao: 'Não sei',
    larguraEntrada: '',
    observacoes: '',
    atualizadoEm: '',
  };
}

export default function AvaliarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const registroId = Number(id);

  const db = useSQLiteContext();
  const bloqueio = useRef(false);

  const [registro, setRegistro] = useState<Registro | null>(null);

  const [formulario, setFormulario] = useState<Avaliacao>(
    criarAvaliacao(registroId),
  );

  const [avaliacaoSalva, setAvaliacaoSalva] =
    useState<Avaliacao | null>(null);

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      if (
        !Number.isInteger(registroId) ||
        registroId <= 0
      ) {
        setRegistro(null);
        return;
      }

      const [registroEncontrado, avaliacaoEncontrada] =
        await Promise.all([
          buscarRegistro(db, registroId),
          buscarAvaliacao(db, registroId),
        ]);

      setRegistro(registroEncontrado);
      setAvaliacaoSalva(avaliacaoEncontrada);

      setFormulario(
        avaliacaoEncontrada ?? criarAvaliacao(registroId),
      );
    } catch {
      setErro('Não foi possível carregar o questionário.');
    } finally {
      setLoading(false);
    }
  }, [db, registroId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function alterar<K extends keyof Avaliacao>(
    campo: K,
    valor: Avaliacao[K],
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));

    setMensagem('');
  }

  async function salvar() {
    if (!registro || bloqueio.current) return;

    setErro('');
    setMensagem('');

    const textoLargura = formulario.larguraEntrada.trim();

    if (textoLargura) {
      const formatoValido = /^\d+(?:[.,]\d+)?$/.test(
        textoLargura,
      );

      const largura = Number(
        textoLargura.replace(',', '.'),
      );

      if (
        !formatoValido ||
        !Number.isFinite(largura) ||
        largura <= 0
      ) {
        setErro(
          'Informe uma largura positiva em centímetros, como 90 ou 90,5, ou deixe o campo vazio.',
        );
        return;
      }
    }

    bloqueio.current = true;
    setSalvando(true);

    try {
      const dados: Avaliacao = {
        ...formulario,
        registroId: registro.id,
        larguraEntrada: textoLargura,
        observacoes: formulario.observacoes.trim(),
        atualizadoEm: new Date().toISOString(),
      };

      await salvarAvaliacao(db, dados);

      setFormulario(dados);
      setAvaliacaoSalva(dados);
      setMensagem('Questionário salvo neste dispositivo.');
    } catch {
      setErro(
        'Não foi possível salvar. Verifique se o registro ainda existe e tente novamente.',
      );
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator
          accessibilityLabel="Carregando questionário"
          color={theme.colors.primary}
        />
      </Screen>
    );
  }

  if (erro && !registro) {
    return (
      <Screen>
        <ErrorMessage message={erro} />

        <Button
          title="Tentar novamente"
          onPress={() => void carregar()}
        />
      </Screen>
    );
  }

  if (!registro) {
    return (
      <Screen>
        <Title>Registro não encontrado</Title>
        <Body>
          Abra o questionário a partir de um registro existente.
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>Avaliação preliminar</Title>

      <Body>{registro.estabelecimento}</Body>

      <Card>
        <Body>
          Simulação do preenchimento pelo responsável.
          Responda conforme a situação observada.
          Se não souber, selecione “Não sei”.
        </Body>

        <Body>
          As respostas não certificam acessibilidade nem
          substituem uma avaliação técnica profissional.
        </Body>
      </Card>

      {perguntas.map((pergunta) => (
        <Card key={pergunta.campo}>
          <Text style={styles.question}>
            {pergunta.titulo}
          </Text>

          <View style={styles.options}>
            {RESPOSTAS_AVALIACAO.map((resposta) => {
              const selecionada =
                formulario[pergunta.campo] === resposta;

              return (
                <Pressable
                  key={resposta}
                  accessibilityRole="radio"
                  accessibilityLabel={
                    `${pergunta.titulo} ${resposta}`
                  }
                  accessibilityState={{
                    checked: selecionada,
                    disabled: salvando,
                  }}
                  disabled={salvando}
                  onPress={() =>
                    alterar(
                      pergunta.campo,
                      resposta as RespostaAvaliacao,
                    )
                  }
                  style={[
                    styles.option,
                    selecionada && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selecionada && styles.selectedText,
                    ]}
                  >
                    {selecionada ? '✓ ' : ''}
                    {resposta}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <Card>
        <Field
          label="Largura livre da entrada em centímetros (opcional)"
          placeholder="Ex.: 90"
          keyboardType="decimal-pad"
          value={formulario.larguraEntrada}
          onChangeText={(valor) =>
            alterar('larguraEntrada', valor)
          }
          maxLength={10}
          editable={!salvando}
        />

        <Body>
          Se puder medir com segurança, observe a passagem
          livre entre os obstáculos usando uma trena.
          Se não souber medir, deixe o campo vazio.
        </Body>
      </Card>

      <Field
        label="Observações complementares (opcional)"
        placeholder="Descreva outras dificuldades observadas."
        value={formulario.observacoes}
        onChangeText={(valor) =>
          alterar('observacoes', valor)
        }
        multiline
        maxLength={1000}
        editable={!salvando}
      />

      {erro ? <ErrorMessage message={erro} /> : null}

      {mensagem ? (
        <Text
          accessibilityLiveRegion="polite"
          style={styles.feedback}
        >
          {mensagem}
        </Text>
      ) : null}

      <Button
        title="Salvar questionário"
        loading={salvando}
        onPress={() => void salvar()}
      />

      {avaliacaoSalva ? (
        <Card>
          <Text
            accessibilityRole="header"
            style={styles.heading}
          >
            Triagem das respostas salvas
          </Text>

          <Body>
            Atualizada em{' '}
            {new Date(
              avaliacaoSalva.atualizadoEm,
            ).toLocaleString('pt-BR')}
          </Body>

          {gerarTriagem(avaliacaoSalva).map((orientacao) => (
            <Body key={orientacao}>{orientacao}</Body>
          ))}

          <Body>
            Alterações no formulário só entram nesta triagem
            depois de salvar novamente.
          </Body>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  question: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
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
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
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
    fontWeight: '700',
    color: theme.colors.primary,
  },

  feedback: {
    fontSize: theme.fontSize.body,
    color: theme.colors.primary,
  },
});