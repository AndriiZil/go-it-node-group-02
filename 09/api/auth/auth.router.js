const { Router } = require('express');

const AuthController = require('./auth.controller');

const router = Router();

router.post('/sign-up', AuthController.signUp);

router.post('/sign-in', AuthController.singIn);

router.get('/verify/:token', AuthController.verifyEmail);

module.exports = router;