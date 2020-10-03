const { Router } = require('express');

const UserController = require('./user.controller');

const router = Router();

router.get('/', UserController.getUsers);

router.post('/', UserController.validateCreateUser, UserController.createUser);

router.patch('/:id', UserController.validateUpdateUser, UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

module.exports = router;