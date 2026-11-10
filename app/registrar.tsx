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

import { criarRegistro } from '../src/database/registros';
import { theme } from '../src/theme';

import { CATEGORIAS, type Categoria } from '../src/types';

export default function RegistrarScreen() {
  const db = useSQLiteContext();
  const enviando = useRef(false);

  const [estabelecimento, setEstabelecimento] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Entrada');
  const [descricao, setDescricao] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar() {
    if (enviando.current) return;

    setErro('');

    if (
      !estabelecimento.trim() ||
      !localizacao.trim() ||
      !descricao.trim()
    ) {
      setErro('Preencha o estabelecimento, o local e a descrição.');
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
      });

      router.replace({
        pathname: '/registro/[id]',
        params: { id: String(id) },
      });
    } catch {
      setErro(
        'Não foi possível salvar o registro. Tente novamente.',
      );
    } finally {
      enviando.current = false;
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <Title>Qual dificuldade você encontrou?</Title>

        <Body>
          Nesta demonstração, use informações fictícias e não
          inclua nomes, telefones ou outros dados pessoais.
        </Body>

        <Field
          label="Nome do estabelecimento (obrigatório)"
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
                accessibilityLabel={item}
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
          label="Descrição da dificuldade (obrigatório)"
          placeholder="Explique o que dificultou o acesso ou o uso do local."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={1000}
          editable={!salvando}
        />

        {erro ? <ErrorMessage message={erro} /> : null}

        <Button
          title="Salvar registro"
          loading={salvando}
          onPress={() => void salvar()}
        />

        <Body>
          O registro é um relato e não substitui uma avaliação
          técnica profissional.
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