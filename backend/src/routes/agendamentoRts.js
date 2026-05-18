const express = require('express');
const { criarAgendamento, listarAgendamentos } = require('../controllers/agendamentoController');

module.exports = (db) => {
    const router = express.Router();
    router.post('/agendamentos', criarAgendamento(db));
    router.get('/agendamentos', listarAgendamentos(db));
    return router;
}