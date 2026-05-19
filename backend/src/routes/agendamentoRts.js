const express = require('express');
const { criarAgendamento, listarAgendamentos, meusAgendamentos, cancelarAgendamento, editarAgendamento } = require('../controllers/agendamentoController');

module.exports = (db) => {
    const router = express.Router();
    router.post('/', criarAgendamento(db));
    router.get('/', listarAgendamentos(db));
    router.get('/usuario/:usuario_id', meusAgendamentos(db));
    router.delete('/:id', cancelarAgendamento(db));
    router.put('/:id', editarAgendamento(db));
    return router;
}