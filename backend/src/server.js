const express = require('express');
const cors = require('cors');
const initDB = require('./database/db');

const authRoutes = require('./routes/authRts');
const salaRoutes = require('./routes/salaRts');
const agendamentoRoutes = require('./routes/agendamentoRts');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

initDB().then(db => {

    app.use('/api', authRoutes(db));
    app.use('/api', salaRoutes(db));
    app.use('/api', agendamentoRoutes(db));

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
});