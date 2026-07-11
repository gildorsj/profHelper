// ---------------------------------------------------------------------------
// Camada de banco de dados (SQLite) do PropHelfer
// ---------------------------------------------------------------------------
// Aqui ficam TODAS as operações de banco. Usamos a API assíncrona do
// expo-sqlite (SDK 57): runAsync / getAllAsync / getFirstAsync / execAsync.
//
// Modelo de dados:
//   professor  1 --- N  salas
//   salas      1 --- N  alunos
//   salas      1 --- N  aulas
//   salas      1 --- N  tarefas
//   aulas      1 --- N  frequencias  N --- 1  alunos
//
// A "frequência" é calculada a partir da tabela `frequencias`: cada aula
// registrada gera um registro (presente = 1 / falta = 0) para cada aluno.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Inicialização: cria as tabelas e insere dados de exemplo na primeira vez.
// Chamada uma única vez pelo <SQLiteProvider onInit={...}> em App.js.
// ---------------------------------------------------------------------------
export async function initDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS professor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      materia TEXT
    );

    CREATE TABLE IF NOT EXISTS salas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      informacoes TEXT,
      online INTEGER NOT NULL DEFAULT 0,
      criada_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sala_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      matricula TEXT,
      email TEXT,
      FOREIGN KEY (sala_id) REFERENCES salas (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS aulas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sala_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      conteudo TEXT,
      FOREIGN KEY (sala_id) REFERENCES salas (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS frequencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aula_id INTEGER NOT NULL,
      aluno_id INTEGER NOT NULL,
      presente INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (aula_id) REFERENCES aulas (id) ON DELETE CASCADE,
      FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sala_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      entrega TEXT,
      concluida INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (sala_id) REFERENCES salas (id) ON DELETE CASCADE
    );
  `);

  // Garante um professor padrão (o cabeçalho do app sempre mostra um).
  const prof = await db.getFirstAsync('SELECT id FROM professor LIMIT 1');
  if (!prof) {
    await db.runAsync(
      'INSERT INTO professor (nome, materia) VALUES (?, ?)',
      'Fulano de Tal',
      'Matéria de Tal'
    );
  }

  // Semente de demonstração (apenas se ainda não existir nenhuma sala).
  const temSala = await db.getFirstAsync('SELECT id FROM salas LIMIT 1');
  if (!temSala) {
    await semearDadosDemo(db);
  }
}

// Dados de exemplo para o app já abrir "vivo" e mostrar a frequência
// funcionando (útil para a apresentação do trabalho).
async function semearDadosDemo(db) {
  const hoje = dataHoje();

  // Uma sala presencial com alunos e algumas aulas lançadas.
  const sala = await db.runAsync(
    'INSERT INTO salas (nome, informacoes, online, criada_em) VALUES (?, ?, ?, ?)',
    'Algoritmos I',
    'Turma do 1º período. Aulas às segundas e quartas.',
    0,
    hoje
  );
  const salaId = sala.lastInsertRowId;

  const nomes = [
    ['Ana Souza', '2024001', 'ana@uemg.br'],
    ['Bruno Lima', '2024002', 'bruno@uemg.br'],
    ['Carla Dias', '2024003', 'carla@uemg.br'],
    ['Diego Alves', '2024004', 'diego@uemg.br'],
  ];
  const alunoIds = [];
  for (const [nome, matricula, email] of nomes) {
    const r = await db.runAsync(
      'INSERT INTO alunos (sala_id, nome, matricula, email) VALUES (?, ?, ?, ?)',
      salaId,
      nome,
      matricula,
      email
    );
    alunoIds.push(r.lastInsertRowId);
  }

  // Lança 8 aulas com presenças variadas (para gerar percentuais realistas).
  // Cada linha = presença de [Ana, Bruno, Carla, Diego] naquela aula.
  const chamadas = [
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 1],
  ];
  for (let i = 0; i < chamadas.length; i++) {
    const aula = await db.runAsync(
      'INSERT INTO aulas (sala_id, data, conteudo) VALUES (?, ?, ?)',
      salaId,
      hoje,
      `Aula ${i + 1}`
    );
    const aulaId = aula.lastInsertRowId;
    for (let j = 0; j < alunoIds.length; j++) {
      await db.runAsync(
        'INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES (?, ?, ?)',
        aulaId,
        alunoIds[j],
        chamadas[i][j]
      );
    }
  }

  await db.runAsync(
    'INSERT INTO tarefas (sala_id, titulo, descricao, entrega) VALUES (?, ?, ?, ?)',
    salaId,
    'Lista de exercícios 1',
    'Resolver os exercícios 1 a 10 do capítulo 2.',
    hoje
  );

  // Uma segunda sala presencial (ainda sem alunos) e uma sala online.
  await db.runAsync(
    'INSERT INTO salas (nome, informacoes, online, criada_em) VALUES (?, ?, ?, ?)',
    'Cálculo I',
    'Turma da noite.',
    0,
    hoje
  );
  await db.runAsync(
    'INSERT INTO salas (nome, informacoes, online, criada_em) VALUES (?, ?, ?, ?)',
    'POO - EAD',
    'Programação Orientada a Objetos (turma online).',
    1,
    hoje
  );
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------
export function dataHoje() {
  return new Date().toISOString().slice(0, 10); // AAAA-MM-DD
}

export function formatarData(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ---------------------------------------------------------------------------
// Professor
// ---------------------------------------------------------------------------
export async function getProfessor(db) {
  return db.getFirstAsync('SELECT * FROM professor ORDER BY id LIMIT 1');
}

export async function salvarProfessor(db, { nome, materia }) {
  const atual = await getProfessor(db);
  if (atual) {
    await db.runAsync(
      'UPDATE professor SET nome = ?, materia = ? WHERE id = ?',
      nome,
      materia ?? null,
      atual.id
    );
    return atual.id;
  }
  const r = await db.runAsync(
    'INSERT INTO professor (nome, materia) VALUES (?, ?)',
    nome,
    materia ?? null
  );
  return r.lastInsertRowId;
}

// ---------------------------------------------------------------------------
// Salas
// ---------------------------------------------------------------------------
export async function criarSala(db, { nome, informacoes, online }) {
  const r = await db.runAsync(
    'INSERT INTO salas (nome, informacoes, online, criada_em) VALUES (?, ?, ?, ?)',
    nome,
    informacoes ?? null,
    online ? 1 : 0,
    dataHoje()
  );
  return r.lastInsertRowId;
}

// Lista as salas de um tipo (0 = presencial, 1 = online) já com a
// contagem de alunos de cada uma.
export async function listarSalas(db, online) {
  return db.getAllAsync(
    `SELECT s.*, (
        SELECT COUNT(*) FROM alunos a WHERE a.sala_id = s.id
     ) AS total_alunos
     FROM salas s
     WHERE s.online = ?
     ORDER BY s.nome COLLATE NOCASE`,
    online ? 1 : 0
  );
}

export async function getSala(db, id) {
  return db.getFirstAsync('SELECT * FROM salas WHERE id = ?', id);
}

export async function atualizarSala(db, id, { nome, informacoes }) {
  await db.runAsync(
    'UPDATE salas SET nome = ?, informacoes = ? WHERE id = ?',
    nome,
    informacoes ?? null,
    id
  );
}

export async function removerSala(db, id) {
  await db.runAsync('DELETE FROM salas WHERE id = ?', id);
}

// ---------------------------------------------------------------------------
// Alunos
// ---------------------------------------------------------------------------
export async function adicionarAluno(db, { salaId, nome, matricula, email }) {
  const r = await db.runAsync(
    'INSERT INTO alunos (sala_id, nome, matricula, email) VALUES (?, ?, ?, ?)',
    salaId,
    nome,
    matricula ?? null,
    email ?? null
  );
  return r.lastInsertRowId;
}

export async function listarAlunos(db, salaId) {
  return db.getAllAsync(
    'SELECT * FROM alunos WHERE sala_id = ? ORDER BY nome COLLATE NOCASE',
    salaId
  );
}

export async function removerAluno(db, id) {
  await db.runAsync('DELETE FROM alunos WHERE id = ?', id);
}

export async function contarAlunos(db, salaId) {
  const r = await db.getFirstAsync(
    'SELECT COUNT(*) AS total FROM alunos WHERE sala_id = ?',
    salaId
  );
  return r ? r.total : 0;
}

// ---------------------------------------------------------------------------
// Aulas e frequência
// ---------------------------------------------------------------------------
export async function contarAulas(db, salaId) {
  const r = await db.getFirstAsync(
    'SELECT COUNT(*) AS total FROM aulas WHERE sala_id = ?',
    salaId
  );
  return r ? r.total : 0;
}

// Registra uma aula e a chamada (presença de cada aluno) numa transação.
// presencas = [{ alunoId, presente }]
export async function registrarAula(db, { salaId, data, conteudo, presencas }) {
  let aulaId;
  await db.withTransactionAsync(async () => {
    const aula = await db.runAsync(
      'INSERT INTO aulas (sala_id, data, conteudo) VALUES (?, ?, ?)',
      salaId,
      data || dataHoje(),
      conteudo ?? null
    );
    aulaId = aula.lastInsertRowId;
    for (const p of presencas) {
      await db.runAsync(
        'INSERT INTO frequencias (aula_id, aluno_id, presente) VALUES (?, ?, ?)',
        aulaId,
        p.alunoId,
        p.presente ? 1 : 0
      );
    }
  });
  return aulaId;
}

export async function listarAulas(db, salaId) {
  return db.getAllAsync(
    'SELECT * FROM aulas WHERE sala_id = ? ORDER BY id DESC',
    salaId
  );
}

// Frequência de cada aluno da sala: presenças, faltas e percentual.
export async function frequenciaDosAlunos(db, salaId) {
  const linhas = await db.getAllAsync(
    `SELECT
        a.id, a.nome, a.matricula, a.email,
        COALESCE(SUM(CASE WHEN f.presente = 1 THEN 1 ELSE 0 END), 0) AS presencas,
        COALESCE(SUM(CASE WHEN f.presente = 0 THEN 1 ELSE 0 END), 0) AS faltas,
        COUNT(f.id) AS registros
     FROM alunos a
     LEFT JOIN frequencias f ON f.aluno_id = a.id
     WHERE a.sala_id = ?
     GROUP BY a.id
     ORDER BY a.nome COLLATE NOCASE`,
    salaId
  );
  return linhas.map((l) => ({
    ...l,
    percentual: l.registros > 0 ? Math.round((l.presencas / l.registros) * 100) : 0,
  }));
}

// Frequência geral da sala (média de presença em todas as chamadas).
export async function frequenciaGeralSala(db, salaId) {
  const totalAulas = await contarAulas(db, salaId);
  const r = await db.getFirstAsync(
    `SELECT
        COALESCE(SUM(CASE WHEN f.presente = 1 THEN 1 ELSE 0 END), 0) AS presencas,
        COUNT(f.id) AS registros
     FROM frequencias f
     JOIN aulas au ON au.id = f.aula_id
     WHERE au.sala_id = ?`,
    salaId
  );
  const presencas = r ? r.presencas : 0;
  const registros = r ? r.registros : 0;
  return {
    totalAulas,
    percentual: registros > 0 ? Math.round((presencas / registros) * 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Tarefas
// ---------------------------------------------------------------------------
export async function adicionarTarefa(db, { salaId, titulo, descricao, entrega }) {
  const r = await db.runAsync(
    'INSERT INTO tarefas (sala_id, titulo, descricao, entrega) VALUES (?, ?, ?, ?)',
    salaId,
    titulo,
    descricao ?? null,
    entrega ?? null
  );
  return r.lastInsertRowId;
}

export async function listarTarefas(db, salaId) {
  return db.getAllAsync(
    'SELECT * FROM tarefas WHERE sala_id = ? ORDER BY id DESC',
    salaId
  );
}

export async function alternarTarefa(db, id, concluida) {
  await db.runAsync(
    'UPDATE tarefas SET concluida = ? WHERE id = ?',
    concluida ? 1 : 0,
    id
  );
}

export async function removerTarefa(db, id) {
  await db.runAsync('DELETE FROM tarefas WHERE id = ?', id);
}
