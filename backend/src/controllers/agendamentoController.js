const criarAgendamento = (db) => async (req, res) => {
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

module.exports = { criarAgendamento, listarAgendamentos };