import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  NovoRegistro,
  Registro,
} from '../types';

/**
 * Cria a tabela e atualiza bancos existentes.
 * Não apaga os registros já cadastrados.
 */
export async function iniciarBanco(
  db: SQLiteDatabase,
): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS registros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      localizacao TEXT NOT NULL,
      categoria TEXT NOT NULL,
      descricao TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Registrado',
      criadoEm TEXT NOT NULL,
      foto TEXT
    );
  `);

  // Bancos criados pela primeira versão ainda não possuem foto.
  const colunas = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(registros)',
  );

  const temColunaFoto = colunas.some(
    (coluna) => coluna.name === 'foto',
  );

  if (!temColunaFoto) {
    await db.execAsync(`
      ALTER TABLE registros ADD COLUMN foto TEXT;
    `);
  }
}

/**
 * Salva um novo registro e retorna seu identificador.
 */
export async function criarRegistro(
  db: SQLiteDatabase,
  registro: NovoRegistro,
): Promise<number> {
  const resultado = await db.runAsync(
    `
      INSERT INTO registros (
        estabelecimento,
        localizacao,
        categoria,
        descricao,
        status,
        criadoEm,
        foto
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    registro.estabelecimento.trim(),
    registro.localizacao.trim(),
    registro.categoria,
    registro.descricao.trim(),
    'Registrado',
    new Date().toISOString(),
    registro.foto ?? null,
  );

  return resultado.lastInsertRowId;
}

/**
 * Lista os registros do mais recente para o mais antigo.
 */
export async function listarRegistros(
  db: SQLiteDatabase,
): Promise<Registro[]> {
  return db.getAllAsync<Registro>(
    `
      SELECT *
      FROM registros
      ORDER BY id DESC
    `,
  );
}

/**
 * Busca um registro pelo identificador.
 */
export async function buscarRegistro(
  db: SQLiteDatabase,
  id: number,
): Promise<Registro | null> {
  return db.getFirstAsync<Registro>(
    `
      SELECT *
      FROM registros
      WHERE id = ?
    `,
    id,
  );
}

/**
 * Atualiza o status de demonstração de um registro.
 */
export async function atualizarStatusRegistro(
  db: SQLiteDatabase,
  id: number,
  status: Registro['status'],
): Promise<void> {
  const resultado = await db.runAsync(
    `
      UPDATE registros
      SET status = ?
      WHERE id = ?
    `,
    status,
    id,
  );

  if (resultado.changes === 0) {
    throw new Error('Registro não encontrado.');
  }
}

/**
 * Exclui um registro.
 * Se a tabela de avaliações já estiver configurada,
 * seu gatilho também remove o questionário correspondente.
 */
export async function excluirRegistro(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM registros
      WHERE id = ?
    `,
    id,
  );
}