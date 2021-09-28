const express = require('express');
const router = express.Router();
const fileUtils = require('../utils/fileutils');
const userMiddleware = require('../middleware/users')

const api = require('../api/api');
const login = require('../api/login');
const register = require('../api/register');

router.get('/v1/', api.contoh_fungsi);
router.post('/v1/register', userMiddleware.validateRegister, register.register);
router.post('/v1/login', login.login);

module.exports = router;