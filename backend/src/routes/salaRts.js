const express = require('express');
const { salasController } = require('../controllers/salasController');

module.exports = (db) => {
    const router = express.Router();
    router.get('/', salasController(db));
    return router;
}