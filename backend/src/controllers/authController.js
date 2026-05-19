const loginController = (db) => async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Usuário é obrigatório' });
    }

    try {
        let user = await db.get('SELECT * FROM usuarios WHERE nome = ?', [username]);

        if (user) {
            await db.run('UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
            console.log(`[LOGIN] Usuário existente "${username}" fez login. Último login atualizado.`);
        } else {
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