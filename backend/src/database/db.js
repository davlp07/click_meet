const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function initDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Cria a tabela de Usuários
    // O UNIQUE garante que não teremos dois usuários com o mesmo nome exato
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            ultimo_login DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Cria a tabela de Salas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS salas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            capacidade INTEGER NOT NULL,
            horario_abertura TEXT NOT NULL DEFAULT '08:00',
            horario_fechamento TEXT NOT NULL DEFAULT '18:00'
        )
    `);

    // Cria a tabela de Agendamentos
    await db.exec(`
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sala_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            horario_inicio TEXT NOT NULL,
            horario_fim TEXT NOT NULL,
            FOREIGN KEY (sala_id) REFERENCES salas (id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
        )
    `);

    // Limpeza de usuários inativos há mais de 30 dias
    // Isso vai rodar toda vez que o servidor Node for iniciado
    const result = await db.run(`
        DELETE FROM usuarios 
        WHERE ultimo_login <= datetime('now', '-30 days') 
        AND id NOT IN (SELECT usuario_id FROM agendamentos WHERE usuario_id IS NOT NULL)
    `);
    if (result.changes > 0) {
        console.log(`[LIMPEZA] Limpeza automática: ${result.changes} usuário(s) inativo(s) removido(s).`);
    }

    const salasExistem = await db.get('SELECT COUNT(*) as count FROM salas');
    if (salasExistem.count === 0) {
        await db.run(`INSERT INTO salas (nome, capacidade, horario_abertura, horario_fechamento) VALUES ('Sala 1 (Reuniões Rápidas)', 4, '08:00', '18:00')`);
        await db.run(`INSERT INTO salas (nome, capacidade, horario_abertura, horario_fechamento) VALUES ('Sala 2 (Equipe)', 8, '08:00', '20:00')`);
        await db.run(`INSERT INTO salas (nome, capacidade, horario_abertura, horario_fechamento) VALUES ('Sala 3 (Diretoria)', 12, '09:00', '17:00')`);
    }

    console.log('Banco de dados SQLite inicializado e estruturado!');
    return db;
}

module.exports = initDB;