import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  NovoRegistro,
  Registro,
} from '../types';

export type EventoRegistro = {
  id: number;
  registroId: number;
  titulo: string;
  descricao: string;
  criadoEm: string;
};

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

  const colunas = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(registros)',
  );

  const temColunaFoto = colunas.some(
    (coluna) => coluna.name === 'foto',
  );

  if (!temColunaFoto) {
    await db.execAsync(
      'ALTER TABLE registros ADD COLUMN foto TEXT',
    );
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS historico_registros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registroId INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      criadoEm TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_historico_registro
    ON historico_registros (registroId, id);

    CREATE TRIGGER IF NOT EXISTS historico_apos_criar_registro
    AFTER INSERT ON registros
    BEGIN
      INSERT INTO historico_registros (
        registroId,
        titulo,
        descricao,
        criadoEm
      )
      VALUES (
        NEW.id,
        'Relato registrado',
        'Registro salvo neste dispositivo. Nenhum estabelecimento foi notificado.',
        NEW.criadoEm
      );
    END;

    CREATE TRIGGER IF NOT EXISTS historico_apos_alterar_status
    AFTER UPDATE OF status ON registros
    WHEN OLD.status <> NEW.status
    BEGIN
      INSERT INTO historico_registros (
        registroId,
        titulo,
        descricao,
        criadoEm
      )
      VALUES (
        NEW.id,
        'Status atualizado: ' || NEW.status,
        'Simulação acadêmica. Status anterior: ' || OLD.status ||
        '. Não representa resposta do estabelecimento.',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      );
    END;

    CREATE TRIGGER IF NOT EXISTS historico_apos_excluir_registro
    AFTER DELETE ON registros
    BEGIN
      DELETE FROM historico_registros
      WHERE registroId = OLD.id;
    END;

    INSERT INTO historico_registros (
      registroId,
      titulo,
      descricao,
      criadoEm
    )
    SELECT
      registros.id,
      'Acompanhamento iniciado',
      'Registro anterior à linha do tempo. Status observado: ' ||
      registros.status ||
      '. Mudanças anteriores não foram registradas.',
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    FROM registros
    WHERE NOT EXISTS (
      SELECT 1
      FROM historico_registros
      WHERE historico_registros.registroId = registros.id
    );
  `);
}

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

export async function listarHistoricoRegistro(
  db: SQLiteDatabase,
  registroId: number,
): Promise<EventoRegistro[]> {
  return db.getAllAsync<EventoRegistro>(
    `
      SELECT *
      FROM historico_registros
      WHERE registroId = ?
      ORDER BY id DESC
    `,
    registroId,
  );
}

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

  // O gatilho registra a mudança na mesma operação do banco.
  // Salvar o mesmo status não cria um novo evento.
}

export async function excluirRegistro(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    'DELETE FROM registros WHERE id = ?',
    id,
  );
}