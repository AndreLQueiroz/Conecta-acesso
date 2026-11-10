import type {
  Categoria,
  Parceiro,
} from '../types';

const parceiros: Parceiro[] = [
  {
    id: '1',
    nome: 'Projeto Acesso',
    especialidade:
      'Avaliação profissional de entradas e circulação.',
    categorias: ['Entrada', 'Circulação'],
  },

  {
    id: '2',
    nome: 'Comunicação Clara',
    especialidade:
      'Avaliação de sinalização e orientação nos espaços.',
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
    throw new Error(
      'Falha simulada na consulta de parceiros.',
    );
  }

  return parceiros.filter((parceiro) =>
    parceiro.categorias.includes(categoria),
  );
}