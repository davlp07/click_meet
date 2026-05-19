const criarAgendamento = (db) => async (req, res) => {

    const { sala_id, usuario_id, data, horario_inicio, horario_fim } = req.body;

    if (!sala_id || !usuario_id || !data || !horario_inicio || !horario_fim) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        await db.run(
            'INSERT INTO agendamentos (sala_id, usuario_id, data, horario_inicio, horario_fim) VALUES (?, ?, ?, ?, ?)',
            [req.body.sala_id, req.body.usuario_id, req.body.data, req.body.horario_inicio, req.body.horario_fim]
        );
        console.log(`[AGENDAMENTO] Agendamento criado para sala_id: ${req.body.sala_id}, usuario_id: ${req.body.usuario_id}`);
        res.status(201).json({ message: 'Agendamento criado com sucesso' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const listarAgendamentos = (db) => async (req, res) => {
    try {
        const agendamentos = await db.all('SELECT * FROM agendamentos');
        res.json(agendamentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const meusAgendamentos = (db) => async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const agendamentos = await db.all(`
            SELECT a.*, s.nome AS sala_nome
            FROM agendamentos a
            JOIN salas s ON a.sala_id = s.id
            WHERE a.usuario_id = ?
            ORDER BY a.data ASC, a.horario_inicio ASC
        `, [usuario_id]);

        res.json(agendamentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const cancelarAgendamento = (db) => async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM agendamentos WHERE id = ?', [id]);
        res.json({ message: 'Agendamento cancelado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const editarAgendamento = (db) => async (req, res) => {
    const { id } = req.params;
    const { sala_id, data, horario_inicio, horario_fim } = req.body;
    try {
        await db.run(
            'UPDATE agendamentos SET sala_id = ?, data = ?, horario_inicio = ?, horario_fim = ? WHERE id = ?',
            [sala_id, data, horario_inicio, horario_fim, id]
        );
        res.json({ message: 'Agendamento editado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

module.exports = { criarAgendamento, listarAgendamentos, meusAgendamentos, cancelarAgendamento, editarAgendamento };