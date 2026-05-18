const salasController = (db) => async (req, res) => {
    try {
        const salas = await db.all('SELECT * FROM salas');
        res.json(salas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

module.exports = { salasController };