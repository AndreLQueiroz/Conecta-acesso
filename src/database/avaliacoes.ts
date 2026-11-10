import type { SQLiteDatabase } from 'expo-sqlite';

import type { Avaliacao } from '../types';

export async function iniciarTabelaAvaliacoes(
  db: SQLiteDatabase,
) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      registroId INTEGER PRIMARY KEY NOT NULL,
      entrada TEXT NOT NULL,
      circulacao TEXT NOT NULL,
      atendimento TEXT NOT NULL,
      sinalizacao TEXT NOT NULL,
      larguraEntrada TEXT NOT NULL DEFAULT '',
      observacoes TEXT NOT NULL DEFAULT '',
      atualizadoEm TEXT NOT NULL
    );

    CREATE TRIGGER IF NOT EXISTS excluir_avaliacao_do_registro
    AFTER DELETE ON registros
    BEGIN
      DELETE FROM avaliacoes
      WHERE registroId = OLD.id;
    END;
  `);
}

export async function buscarAvaliacao(
  db: SQLiteDatabase,
  registroId: number,
) {
  return db.getFirstAsync<Avaliacao>(
    'SELECT * FROM avaliacoes WHERE registroId = ?',
    registroId,
  );
}

export async function salvarAvaliacao(
  db: SQLiteDatabase,
  avaliacao: Avaliacao,
) {
  // Só salva se o registro ainda existir.
  const resultado = await db.runAsync(
    `
      INSERT INTO avaliacoes (
        registroId,
        entrada,
        circulacao,
        atendimento,
        sinalizacao,
        larguraEntrada,
        observacoes,
        atualizadoEm
      )
      SELECT ?, ?, ?, ?, ?, ?, ?, ?
      WHERE EXISTS (
        SELECT 1 FROM registros WHERE id = ?
      )
      ON CONFLICT(registroId) DO UPDATE SET
        entrada = excluded.entrada,
        circulacao = excluded.circulacao,
        atendimento = excluded.atendimento,
        sinalizacao = excluded.sinalizacao,
        larguraEntrada = excluded.larguraEntrada,
        observacoes = excluded.observacoes,
        atualizadoEm = excluded.atualizadoEm
    `,
    avaliacao.registroId,
    avaliacao.entrada,
    avaliacao.circulacao,
    avaliacao.atendimento,
    avaliacao.sinalizacao,
    avaliacao.larguraEntrada.trim(),
    avaliacao.observacoes.trim(),
    avaliacao.atualizadoEm,
    avaliacao.registroId,
  );

  if (resultado.changes === 0) {
    throw new Error('O registro não existe mais.');
  }
}