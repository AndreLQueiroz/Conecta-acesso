import type { SQLiteDatabase } from 'expo-sqlite';

import type { NovoRegistro, Registro } from '../types';

export async function iniciarBanco(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS registros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      localizacao TEXT NOT NULL,
      categoria TEXT NOT NULL,
      descricao TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Registrado',
      criadoEm TEXT NOT NULL
    );
  `);
}

export async function criarRegistro(
  db: SQLiteDatabase,
  registro: NovoRegistro,
) {
  const resultado = await db.runAsync(
    `
      INSERT INTO registros (
        estabelecimento,
        localizacao,
        categoria,
        descricao,
        status,
        criadoEm
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    registro.estabelecimento.trim(),
    registro.localizacao.trim(),
    registro.categoria,
    registro.descricao.trim(),
    'Registrado',
    new Date().toISOString(),
  );

  return resultado.lastInsertRowId;
}

export async function listarRegistros(db: SQLiteDatabase) {
  return db.getAllAsync<Registro>(
    'SELECT * FROM registros ORDER BY id DESC',
  );
}

export async function buscarRegistro(
  db: SQLiteDatabase,
  id: number,
) {
  return db.getFirstAsync<Registro>(
    'SELECT * FROM registros WHERE id = ?',
    id,
  );
}
export async function atualizarStatusRegistro(
  db: SQLiteDatabase,
  id: number,
  status: Registro['status'],
) {
  const resultado = await db.runAsync(
    'UPDATE registros SET status = ? WHERE id = ?',
    status,
    id,
  );

  if (resultado.changes === 0) {
    throw new Error('Registro não encontrado.');
  }
}

export async function excluirRegistro(
  db: SQLiteDatabase,
  id: number,
) {
  await db.runAsync(
    'DELETE FROM registros WHERE id = ?',
    id,
  );
}