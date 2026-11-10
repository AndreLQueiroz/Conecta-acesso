import type { Categoria, Parceiro } from '../types';

const parceiros: Parceiro[] = [
  {
    id: '1',
    nome: 'Projeto Acesso — exemplo fictício',
    especialidade: 'Avaliação de entrada e circulação',
    categorias: ['Entrada', 'Circulação'],
  },
  {
    id: '2',
    nome: 'Comunicação Clara — exemplo fictício',
    especialidade: 'Avaliação de sinalização acessível',
    categorias: ['Sinalização'],
  },
];

type Opcoes = {
  simularErro?: boolean;
};

export async function consultarParceiros(
  categoria: Categoria,
  opcoes: Opcoes = {},
): Promise<Parceiro[]> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 700);
  });

  if (opcoes.simularErro) {
    throw new Error('Não foi possível consultar os parceiros.');
  }

  return parceiros.filter((parceiro) =>
    parceiro.categorias.includes(categoria),
  );
}