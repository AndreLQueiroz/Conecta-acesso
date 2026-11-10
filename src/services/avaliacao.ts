import type { Avaliacao } from '../types';

type ItemAvaliado =
  | 'entrada'
  | 'circulacao'
  | 'atendimento'
  | 'sinalizacao';

const orientacoes: Record<ItemAvaliado, string> = {
  entrada:
    'Entrada: solicitar avaliação profissional da dificuldade de acesso relatada.',

  circulacao:
    'Circulação: solicitar avaliação dos obstáculos e do espaço de passagem.',

  atendimento:
    'Atendimento: avaliar os recursos de comunicação e apoio necessários.',

  sinalizacao:
    'Sinalização: solicitar avaliação da identificação e orientação nos espaços.',
};

export function gerarTriagem(avaliacao: Avaliacao): string[] {
  const resultado: string[] = [];

  const itens: ItemAvaliado[] = [
    'entrada',
    'circulacao',
    'atendimento',
    'sinalizacao',
  ];

  for (const item of itens) {
    if (avaliacao[item] === 'Não') {
      resultado.push(orientacoes[item]);
    }
  }

  if (itens.some((item) => avaliacao[item] === 'Não sei')) {
    resultado.push(
      'Há informações desconhecidas. Complete a observação com apoio de um profissional.',
    );
  }

  if (avaliacao.larguraEntrada.trim()) {
    resultado.push(
      'A largura informada é uma observação declarada. A medição isolada não comprova acessibilidade.',
    );
  }

  if (resultado.length === 0) {
    resultado.push(
      'Não foram declaradas dificuldades adicionais neste questionário. Isso não comprova a acessibilidade do estabelecimento.',
    );
  }

  return resultado;
}