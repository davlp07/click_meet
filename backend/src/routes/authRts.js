const express = require('express');
const { loginController } = require('../controllers/authController');

module.exports = (db) => {
    const router = express.Router();
    router.post('/login', loginController(db));
    return router;
};