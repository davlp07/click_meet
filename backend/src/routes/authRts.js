const express = require('express');
const { loginController } = require('../controllers/authController');

module.exports = (db) => {
    const router = express.Router();
    router.post('/', loginController(db));
    return router;
};