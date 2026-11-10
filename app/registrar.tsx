import { useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import {
  Body,
  Button,
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

export default function RegistrarScreen() {
  const db = useSQLiteContext();
  const enviando = useRef(false);

  const [estabelecimento, setEstabelecimento] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] =
    useState<Categoria>('Entrada');

  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar() {
    if (enviando.current) return;

    setErro('');

    if (!estabelecimento.trim()) {
      setErro('Informe o nome do estabelecimento.');
      return;
    }

    if (!localizacao.trim()) {
      setErro('Informe a localização do estabelecimento.');
      return;
    }

    if (descricao.trim().length < 10) {
      setErro(
        'Descreva a dificuldade com pelo menos 10 caracteres.',
      );
      return;
    }

    enviando.current = true;
    setSalvando(true);

    try {
      const id = await criarRegistro(db, {
        estabelecimento,
        localizacao,
        categoria,
        descricao,
        foto,
      });

      router.replace({
        pathname: '/registro/[id]',
        params: { id: String(id) },
      });
    } catch {
      setErro(
        'Não foi possível salvar o registro. Verifique o espaço disponível e tente novamente.',
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
        <Title>Qual dificuldade você encontrou?</Title>

        <Body>
          Descreva a barreira observada para organizar as
          informações sobre o acesso ao estabelecimento.
        </Body>

        <Body>
          Nesta demonstração, use dados e imagens fictícios.
          Não inclua nomes de pessoas, telefones ou documentos.
        </Body>

        <Field
          label="Estabelecimento (obrigatório)"
          placeholder="Ex.: Mercado Exemplo"
          value={estabelecimento}
          onChangeText={setEstabelecimento}
          maxLength={100}
          editable={!salvando}
        />

        <Field
          label="Localização (obrigatório)"
          placeholder="Ex.: Rua Fictícia, 100 — bairro de exemplo"
          value={localizacao}
          onChangeText={setLocalizacao}
          maxLength={180}
          editable={!salvando}
        />

        <Text style={styles.label}>
          Categoria da barreira
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
                onPress={() => setCategoria(item)}
                style={[
                  styles.category,
                  selecionada && styles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selecionada && styles.selectedText,
                  ]}
                >
                  {selecionada ? '✓ ' : ''}
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Field
          label="Descrição (obrigatório, mínimo de 10 caracteres)"
          placeholder="Explique o que dificultou o acesso ou o uso do local."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={1000}
          editable={!salvando}
        />

        <FotoRegistro
          foto={foto}
          onChange={setFoto}
          disabled={salvando}
        />

        {erro ? <ErrorMessage message={erro} /> : null}

        <Button
          title="Salvar registro"
          loading={salvando}
          onPress={() => void salvar()}
        />

        <Body>
          O registro fica salvo neste dispositivo.
          Não há envio automático ao estabelecimento.
        </Body>

        <Body>
          O relato não substitui uma avaliação técnica
          profissional de acessibilidade.
        </Body>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  label: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },

  categories: {
    gap: theme.spacing.sm,
  },

  category: {
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.surface,
  },

  selectedCategory: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  categoryText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },

  selectedText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});