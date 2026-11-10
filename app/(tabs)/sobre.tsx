import {
  StyleSheet,
  Text,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  Body,
  Card,
  Screen,
  Title,
} from '../../src/components/ui';

import { theme } from '../../src/theme';

export default function SobreScreen() {
  return (
    <Screen>
      <Ionicons
        name="accessibility-outline"
        size={theme.sizes.largeIcon}
        color={theme.colors.primary}
        accessible={false}
      />

      <Title>Conectar pessoas. Ampliar possibilidades.</Title>

      <Body>
        O Conecta Acesso organiza relatos de barreiras
        de acessibilidade e informações sobre possíveis
        encaminhamentos a profissionais especializados.
      </Body>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Para quem estamos construindo
        </Text>

        <Body>
          Pessoas com deficiência que encontram dificuldades
          para acessar estabelecimentos e serviços do bairro.
        </Body>

        <Body>
          Também buscamos facilitar a organização das
          informações pelos responsáveis pelos estabelecimentos.
        </Body>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Como funciona
        </Text>

        <Body>
          1. O cidadão registra uma dificuldade de acesso.
        </Body>

        <Body>
          2. O relato pode ser complementado com foto
          e questionário preliminar.
        </Body>

        <Body>
          3. A plataforma organiza as observações e apresenta
          exemplos de especialidades relacionadas.
        </Body>

        <Body>
          4. O acompanhamento é demonstrado por mudanças
          de status salvas localmente.
        </Body>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Limites desta versão
        </Text>

        <Body>
          Este é um protótipo acadêmico. Parceiros e status
          são demonstrativos. Não há comunicação com
          estabelecimentos ou profissionais.
        </Body>

        <Body>
          Não executamos obras, emitimos certificados ou
          substituímos avaliações técnicas profissionais.
        </Body>

        <Body>
          Respostas positivas no questionário não comprovam
          a acessibilidade de um estabelecimento.
        </Body>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Dados e privacidade
        </Text>

        <Body>
          Use somente dados e fotos fictícios.
          Não inclua documentos, rostos ou informações pessoais.
        </Body>

        <Body>
          Os registros ficam no SQLite deste dispositivo
          ou navegador. Não existe sincronização entre
          computador e celular.
        </Body>

        <Body>
          Limpar os dados do navegador ou desinstalar
          o aplicativo pode remover os registros.
        </Body>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.heading}>
          Acessibilidade também na interface
        </Text>

        <Body>
          O aplicativo utiliza textos redimensionáveis,
          controles rotulados, áreas de toque amplas
          e identificação de status por palavras.
        </Body>

        <Body>
          A experiência ainda precisa ser validada com
          leitores de tela e pessoas com deficiência.
        </Body>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
});