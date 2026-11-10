import {
  useEffect,
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
  Body,
  Button,
  Card,
  ErrorMessage,
  Screen,
  Title,
} from '../../src/components/ui';

import { consultarParceiros } from '../../src/services/parceiros';
import { theme } from '../../src/theme';

import {
  CATEGORIAS,
  type Categoria,
  type Parceiro,
} from '../../src/types';

const descricoes: Record<Categoria, string> = {
  Entrada:
    'Dificuldades para chegar à entrada ou acessar o interior do estabelecimento.',

  Circulação:
    'Obstáculos ou dificuldades para se deslocar e utilizar os espaços.',

  Atendimento:
    'Dificuldades de comunicação e de acesso ao atendimento oferecido.',

  Sinalização:
    'Dificuldades para identificar ambientes, serviços e orientações.',
};

export default function ExplorarScreen() {
  const [categoria, setCategoria] =
    useState<Categoria>('Entrada');

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [simularErro, setSimularErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro('');
    setParceiros([]);

    consultarParceiros(categoria, {
      simularErro,
    })
      .then((resultado) => {
        if (ativo) setParceiros(resultado);
      })
      .catch(() => {
        if (ativo) {
          setErro(
            simularErro
              ? 'Falha de demonstração ativada. Use o botão abaixo para recuperar a consulta.'
              : 'Não foi possível consultar os parceiros.',
          );
        }
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [categoria, simularErro, tentativa]);

  function tentarNovamente() {
    setSimularErro(false);
    setTentativa((valor) => valor + 1);
  }

  return (
    <Screen>
      <Title>Entenda a barreira. Conheça possibilidades.</Title>

      <Body>
        Explore categorias e exemplos de especialidades
        relacionadas às dificuldades relatadas.
      </Body>

      <View style={styles.categories}>
        {CATEGORIAS.map((item) => {
          const selecionada = categoria === item;

          return (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityLabel={`Explorar categoria: ${item}`}
              accessibilityState={{ checked: selecionada }}
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

      <Card>
        <Ionicons
          name="accessibility-outline"
          size={theme.sizes.largeIcon}
          color={theme.colors.primary}
          accessible={false}
        />

        <Text accessibilityRole="header" style={styles.heading}>
          {categoria}
        </Text>

        <Body>{descricoes[categoria]}</Body>

        <Body>
          A situação deve ser avaliada no seu contexto.
          Esta descrição não é um diagnóstico técnico.
        </Body>
      </Card>

      <Text accessibilityRole="header" style={styles.heading}>
        Especialidades e parceiros
      </Text>

      <Body>
        Todos os parceiros exibidos são fictícios.
        Não há contratação ou encaminhamento real.
      </Body>

      {loading ? (
        <Card>
          <ActivityIndicator
            accessibilityLabel="Consultando parceiros"
            color={theme.colors.primary}
          />
          <Body>Buscando exemplos desta categoria…</Body>
        </Card>
      ) : erro ? (
        <Card>
          <ErrorMessage message={erro} />

          <Button
            title="Tentar novamente sem falha simulada"
            onPress={tentarNovamente}
          />
        </Card>
      ) : parceiros.length === 0 ? (
        <Card>
          <Ionicons
            name="search-outline"
            size={theme.sizes.largeIcon}
            color={theme.colors.primary}
            accessible={false}
          />

          <Text style={styles.heading}>
            Nenhum parceiro disponível nesta categoria
          </Text>

          <Body>
            A base de demonstração ainda não possui
            exemplos para essa especialidade.
          </Body>
        </Card>
      ) : (
        parceiros.map((parceiro) => (
          <Card key={parceiro.id}>
            <View style={styles.partnerHeader}>
              <Ionicons
                name="briefcase-outline"
                size={theme.sizes.largeIcon}
                color={theme.colors.primary}
                accessible={false}
              />

              <Text style={styles.exampleLabel}>
                EXEMPLO FICTÍCIO
              </Text>
            </View>

            <Text style={styles.heading}>
              {parceiro.nome}
            </Text>

            <Body>{parceiro.especialidade}</Body>

            <Body>
              Categorias: {parceiro.categorias.join(', ')}
            </Body>
          </Card>
        ))
      )}

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Demonstração da consulta
        </Text>

        <Body>
          Este controle permite apresentar o tratamento
          de erro exigido na atividade.
        </Body>

        <Button
          title={
            simularErro
              ? 'Desativar falha simulada'
              : 'Simular falha de consulta'
          }
          secondary
          onPress={() => setSimularErro((valor) => !valor)}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: theme.colors.primary,
  },

  categoryText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },

  selectedText: {
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },

  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },

  partnerHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  exampleLabel: {
    fontSize: theme.fontSize.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});