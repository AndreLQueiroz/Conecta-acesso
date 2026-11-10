import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  AccessibilityInfo,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
  Title,
} from '../src/components/ui';

import { FotoRegistro } from '../src/components/FotoRegistro';

import { criarRegistro } from '../src/database/registros';
import { theme } from '../src/theme';

import {
  CATEGORIAS,
  type Categoria,
} from '../src/types';

const ETAPAS = [
  {
    nome: 'Local',
    titulo: 'Onde aconteceu?',
    descricao:
      'Informe o estabelecimento e uma referência de localização.',
  },
  {
    nome: 'Barreira',
    titulo: 'O que dificultou o acesso?',
    descricao:
      'Escolha a categoria e descreva a situação observada.',
  },
  {
    nome: 'Foto',
    titulo: 'Uma imagem pode ajudar.',
    descricao:
      'Adicione uma foto fictícia da barreira ou continue sem imagem.',
  },
  {
    nome: 'Revisão',
    titulo: 'Confira seu relato.',
    descricao:
      'Revise as informações antes de salvar neste dispositivo.',
  },
] as const;

const DICAS_CATEGORIA: Record<Categoria, string> = {
  Entrada:
    'Exemplo fictício: um degrau na entrada dificultou o acesso ao estabelecimento.',

  Circulação:
    'Exemplo fictício: objetos no corredor dificultaram a passagem pelo espaço.',

  Atendimento:
    'Exemplo fictício: não havia uma alternativa de comunicação adequada à necessidade relatada.',

  Sinalização:
    'Exemplo fictício: a identificação dos ambientes não permitiu encontrar o serviço desejado.',
};

type NomeIcone = React.ComponentProps<typeof Ionicons>['name'];

const ICONES_CATEGORIA: Record<Categoria, NomeIcone> = {
  Entrada: 'enter-outline',
  Circulação: 'walk-outline',
  Atendimento: 'chatbubbles-outline',
  Sinalização: 'compass-outline',
};

export default function RegistrarScreen() {
  const db = useSQLiteContext();

  const enviando = useRef(false);
  const rascunhoAlterado = useRef(false);

  const [etapa, setEtapa] = useState(0);

  const [estabelecimento, setEstabelecimento] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] =
    useState<Categoria>('Entrada');

  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroFoto, setErroFoto] = useState(false);

  const [confirmarDescarte, setConfirmarDescarte] =
    useState(false);

  const etapaAtual = ETAPAS[etapa];

  // Limpa somente mensagens transitórias ao reabrir a tela.
  // As informações digitadas permanecem enquanto a tela
  // continuar montada na navegação.
  useFocusEffect(
    useCallback(() => {
      setErro('');
      setConfirmarDescarte(false);
    }, []),
  );

  function marcarAlteracao() {
    rascunhoAlterado.current = true;
    setErro('');
  }

  function mudarEtapa(proximaEtapa: number) {
    Keyboard.dismiss();
    setErro('');
    setConfirmarDescarte(false);
    setEtapa(proximaEtapa);

    AccessibilityInfo.announceForAccessibility(
      `Etapa ${proximaEtapa + 1} de ${ETAPAS.length}. ` +
        ETAPAS[proximaEtapa].titulo,
    );
  }

  function validarLocal(): string | null {
    if (!estabelecimento.trim()) {
      return 'Informe o nome do estabelecimento.';
    }

    if (!localizacao.trim()) {
      return 'Informe a localização do estabelecimento.';
    }

    return null;
  }

  function validarBarreira(): string | null {
    if (descricao.trim().length < 10) {
      return 'Descreva a dificuldade com pelo menos 10 caracteres.';
    }

    return null;
  }

  function avancar() {
    if (salvando) return;

    const mensagem =
      etapa === 0
        ? validarLocal()
        : etapa === 1
          ? validarBarreira()
          : null;

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    if (etapa < ETAPAS.length - 1) {
      mudarEtapa(etapa + 1);
    }
  }

  function voltarEtapa() {
    if (salvando || etapa === 0) return;
    mudarEtapa(etapa - 1);
  }

  function limparFormulario() {
    setEstabelecimento('');
    setLocalizacao('');
    setCategoria('Entrada');
    setDescricao('');
    setFoto(null);
    setErroFoto(false);
    setErro('');
    setEtapa(0);
    setConfirmarDescarte(false);

    rascunhoAlterado.current = false;
  }

  function solicitarSaida() {
    if (salvando) return;

    if (rascunhoAlterado.current) {
      setConfirmarDescarte(true);
      return;
    }

    router.replace('/registros');
  }

  function descartarESair() {
    limparFormulario();
    router.replace('/registros');
  }

  async function salvar() {
    if (enviando.current) return;

    const erroLocal = validarLocal();

    if (erroLocal) {
      mudarEtapa(0);
      setErro(erroLocal);
      return;
    }

    const erroBarreira = validarBarreira();

    if (erroBarreira) {
      mudarEtapa(1);
      setErro(erroBarreira);
      return;
    }

    enviando.current = true;
    setSalvando(true);
    setErro('');

    try {
      const id = await criarRegistro(db, {
        estabelecimento,
        localizacao,
        categoria,
        descricao,
        foto,
      });

      limparFormulario();

      router.replace({
        pathname: '/registro/[id]',
        params: { id: String(id) },
      });
    } catch {
      setErro(
        'Não foi possível salvar o relato. Suas informações continuam no formulário. Tente novamente.',
      );
    } finally {
      enviando.current = false;
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              NOVO RELATO
            </Text>

            <Text
              accessibilityLiveRegion="polite"
              style={styles.progressCount}
            >
              Etapa {etapa + 1} de {ETAPAS.length}
            </Text>
          </View>

          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Progresso do cadastro"
            accessibilityValue={{
              min: 1,
              max: ETAPAS.length,
              now: etapa + 1,
              text: etapaAtual.nome,
            }}
            style={styles.progressTrack}
          >
            {ETAPAS.map((item, indice) => (
              <View
                key={item.nome}
                style={[
                  styles.progressSegment,
                  indice <= etapa && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.stepLabels}>
            {ETAPAS.map((item, indice) => (
              <Text
                key={item.nome}
                style={[
                  styles.stepLabel,
                  indice === etapa && styles.activeStepLabel,
                ]}
              >
                {item.nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.heading}>
          <Title>{etapaAtual.titulo}</Title>
          <Body>{etapaAtual.descricao}</Body>
        </View>

        {etapa === 0 ? (
          <>
            <Card>
              <View style={styles.cardHeading}>
                <Ionicons
                  name="storefront-outline"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                  accessible={false}
                />

                <Text style={styles.sectionTitle}>
                  Identificação do local
                </Text>
              </View>

              <Field
                label="Estabelecimento (obrigatório)"
                placeholder="Ex.: Mercado Exemplo"
                value={estabelecimento}
                onChangeText={(valor) => {
                  setEstabelecimento(valor);
                  marcarAlteracao();
                }}
                maxLength={100}
                editable={!salvando}
                autoCapitalize="words"
              />

              <Field
                label="Localização (obrigatório)"
                placeholder="Ex.: Rua Fictícia, 100 — bairro de exemplo"
                value={localizacao}
                onChangeText={(valor) => {
                  setLocalizacao(valor);
                  marcarAlteracao();
                }}
                maxLength={180}
                editable={!salvando}
              />
            </Card>

            <View style={styles.informationBox}>
              <Ionicons
                name="information-circle-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
                accessible={false}
              />

              <Text style={styles.informationText}>
                Este é um protótipo acadêmico.
                Use estabelecimentos e endereços fictícios.
              </Text>
            </View>
          </>
        ) : null}

        {etapa === 1 ? (
          <>
            <Text
              accessibilityRole="header"
              style={styles.sectionTitle}
            >
              Categoria da dificuldade
            </Text>

            <View style={styles.categories}>
              {CATEGORIAS.map((item) => {
                const selecionada = categoria === item;

                return (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityLabel={`Categoria: ${item}`}
                    accessibilityState={{
                      checked: selecionada,
                      disabled: salvando,
                    }}
                    disabled={salvando}
                    onPress={() => {
                      setCategoria(item);
                      marcarAlteracao();
                    }}
                    style={({ pressed }) => [
                      styles.category,
                      selecionada && styles.selectedCategory,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name={ICONES_CATEGORIA[item]}
                      size={theme.sizes.icon}
                      color={
                        selecionada
                          ? theme.colors.onPrimary
                          : theme.colors.primary
                      }
                      accessible={false}
                    />

                    <Text
                      style={[
                        styles.categoryText,
                        selecionada && styles.selectedCategoryText,
                      ]}
                    >
                      {item}
                    </Text>

                    {selecionada ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={theme.sizes.icon}
                        color={theme.colors.accent}
                        accessible={false}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Card>
              <Text style={styles.exampleLabel}>
                EXEMPLO PARA AJUDAR A DESCREVER
              </Text>

              <Body>{DICAS_CATEGORIA[categoria]}</Body>
            </Card>

            <Field
              label="Descrição da barreira (obrigatório)"
              placeholder="O que aconteceu? Como isso dificultou o acesso ou o uso do local?"
              value={descricao}
              onChangeText={(valor) => {
                setDescricao(valor);
                marcarAlteracao();
              }}
              multiline
              maxLength={1000}
              editable={!salvando}
            />

            <Text style={styles.characterCount}>
              {descricao.length}/1000 caracteres.
              Mínimo de 10 caracteres.
            </Text>
          </>
        ) : null}

        {etapa === 2 ? (
          <>
            <FotoRegistro
              foto={foto}
              onChange={(valor) => {
                setFoto(valor);
                setErroFoto(false);
                marcarAlteracao();
              }}
              disabled={salvando}
            />

            <Card>
              <View style={styles.cardHeading}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                  accessible={false}
                />

                <Text style={styles.sectionTitle}>
                  Antes de escolher uma foto
                </Text>
              </View>

              <Body>
                Use uma imagem de teste que ajude a entender
                a barreira. Evite rostos, placas de veículos,
                documentos e informações pessoais.
              </Body>

              <Body>
                A foto é opcional. Você pode continuar
                sem adicionar uma imagem.
              </Body>
            </Card>
          </>
        ) : null}

        {etapa === 3 ? (
          <>
            <Card>
              <View style={styles.cardHeading}>
                <Ionicons
                  name="location-outline"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                  accessible={false}
                />

                <Text style={styles.sectionTitle}>
                  Local informado
                </Text>
              </View>

              <Text style={styles.reviewName}>
                {estabelecimento.trim()}
              </Text>

              <Body>{localizacao.trim()}</Body>

              <Button
                title="Editar local"
                secondary
                disabled={salvando}
                onPress={() => mudarEtapa(0)}
              />
            </Card>

            <Card>
              <View style={styles.cardHeading}>
                <Ionicons
                  name={ICONES_CATEGORIA[categoria]}
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                  accessible={false}
                />

                <Text style={styles.sectionTitle}>
                  Barreira relatada
                </Text>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {categoria}
                </Text>
              </View>

              <Body>{descricao.trim()}</Body>

              <Button
                title="Editar barreira"
                secondary
                disabled={salvando}
                onPress={() => mudarEtapa(1)}
              />
            </Card>

            <Card>
              <Text
                accessibilityRole="header"
                style={styles.sectionTitle}
              >
                Foto do relato
              </Text>

              {foto ? (
                <>
                  <Image
                    source={{ uri: foto }}
                    accessibilityLabel="Foto que será salva no relato"
                    resizeMode="contain"
                    style={styles.photo}
                    onError={() => setErroFoto(true)}
                  />

                  {erroFoto ? (
                    <ErrorMessage message="Não foi possível exibir a foto. Volte à etapa de imagem para trocá-la ou removê-la." />
                  ) : null}
                </>
              ) : (
                <Body>
                  Nenhuma foto adicionada.
                  O registro pode ser salvo normalmente.
                </Body>
              )}

              <Button
                title={foto ? 'Editar foto' : 'Adicionar foto'}
                secondary
                disabled={salvando}
                onPress={() => mudarEtapa(2)}
              />
            </Card>

            <View style={styles.informationBox}>
              <Ionicons
                name="information-circle-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
                accessible={false}
              />

              <Text style={styles.informationText}>
                Ao salvar, o relato fica neste dispositivo.
                Não há envio ao estabelecimento.
                Depois, você poderá preencher o questionário
                e consultar parceiros fictícios.
              </Text>
            </View>
          </>
        ) : null}

        {erro ? <ErrorMessage message={erro} /> : null}

        {confirmarDescarte ? (
          <Card>
            <Text
              accessibilityRole="header"
              style={styles.sectionTitle}
            >
              Descartar este relato?
            </Text>

            <Body>
              As informações deste formulário ainda não
              foram salvas. Se descartar, será necessário
              preencher novamente.
            </Body>

            <Button
              title="Continuar preenchendo"
              disabled={salvando}
              onPress={() => setConfirmarDescarte(false)}
            />

            <Button
              title="Descartar e sair"
              secondary
              disabled={salvando}
              onPress={descartarESair}
            />
          </Card>
        ) : (
          <View style={styles.actions}>
            {etapa === ETAPAS.length - 1 ? (
              <Button
                title="Salvar meu relato"
                loading={salvando}
                onPress={() => void salvar()}
              />
            ) : (
              <Button
                title={
                  etapa === 2 && !foto
                    ? 'Continuar sem foto'
                    : 'Continuar'
                }
                disabled={salvando}
                onPress={avancar}
              />
            )}

            {etapa > 0 ? (
              <Button
                title="Voltar uma etapa"
                secondary
                disabled={salvando}
                onPress={voltarEtapa}
              />
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancelar preenchimento do relato"
              accessibilityState={{ disabled: salvando }}
              disabled={salvando}
              onPress={solicitarSaida}
              style={({ pressed }) => [
                styles.cancelButton,
                (pressed || salvando) && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>
                Cancelar relato
              </Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.footer}>
          Relatar uma dificuldade não substitui uma
          avaliação técnica de acessibilidade.
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  heading: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  progressCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surface,
  },

  progressHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  progressLabel: {
    fontSize: theme.fontSize.small,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  progressCount: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
  },

  progressTrack: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  progressSegment: {
    flex: 1,
    height: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },

  progressSegmentActive: {
    backgroundColor: theme.colors.primary,
  },

  stepLabels: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  stepLabel: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
    textAlign: 'center',
  },

  activeStepLabel: {
    fontWeight: '800',
    color: theme.colors.primary,
  },

  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    flexShrink: 1,
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  informationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.primaryLight,
  },

  informationText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    lineHeight: theme.fontSize.small * 1.5,
    color: theme.colors.primary,
  },

  categories: {
    gap: theme.spacing.sm,
  },

  category: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.surface,
  },

  selectedCategory: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },

  categoryText: {
    flex: 1,
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },

  selectedCategoryText: {
    color: theme.colors.onPrimary,
  },

  exampleLabel: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  characterCount: {
    fontSize: theme.fontSize.small,
    color: theme.colors.muted,
    textAlign: 'right',
  },

  reviewName: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
  },

  categoryBadgeText: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  photo: {
    width: '100%',
    height: theme.sizes.photoHeight,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background,
  },

  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },

  cancelButton: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.danger,
    textAlign: 'center',
  },

  footer: {
    fontSize: theme.fontSize.small,
    lineHeight: theme.fontSize.small * 1.5,
    color: theme.colors.muted,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.6,
  },
});