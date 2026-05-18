const loginController = (db) => async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Usuário é obrigatório' });
    }

    try {
        // Verifica se o usuário já existe no banco
        let user = await db.get('SELECT * FROM usuarios WHERE nome = ?', [username]);

        if (user) {
            // Se existe, atualiza o último login (renova os 30 dias de atividade)
            await db.run('UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
            console.log(`[LOGIN] Usuário existente "${username}" fez login. Último login atualizado.`);
        } else {
            // Se não existe, cria um novo usuário
            const result = await db.run('INSERT INTO usuarios (nome) VALUES (?)', [username]);
            user = { id: result.lastID, nome: username };
            console.log(`[CADASTRO] Novo usuário "${username}" criado e fez login.`);
        }

        res.json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

module.exports = { loginController };