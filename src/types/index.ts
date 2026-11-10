export const CATEGORIAS = [
  'Entrada',
  'Circulação',
  'Atendimento',
  'Sinalização',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const STATUS_REGISTRO = [
  'Registrado',
  'Em análise',
  'Em melhoria',
  'Melhoria informada',
] as const;

export type StatusRegistro = (typeof STATUS_REGISTRO)[number];

export type Registro = {
  id: number;
  estabelecimento: string;
  localizacao: string;
  categoria: Categoria;
  descricao: string;
  status: StatusRegistro;
  criadoEm: string;
  foto?: string | null;
};

export type NovoRegistro = Pick<
  Registro,
  | 'estabelecimento'
  | 'localizacao'
  | 'categoria'
  | 'descricao'
  | 'foto'
>;

export type Parceiro = {
  id: string;
  nome: string;
  especialidade: string;
  categorias: Categoria[];
};

export const RESPOSTAS_AVALIACAO = [
  'Sim',
  'Não',
  'Não sei',
] as const;

export type RespostaAvaliacao =
  (typeof RESPOSTAS_AVALIACAO)[number];

export type Avaliacao = {
  registroId: number;
  entrada: RespostaAvaliacao;
  circulacao: RespostaAvaliacao;
  atendimento: RespostaAvaliacao;
  sinalizacao: RespostaAvaliacao;
  larguraEntrada: string;
  observacoes: string;
  atualizadoEm: string;
};