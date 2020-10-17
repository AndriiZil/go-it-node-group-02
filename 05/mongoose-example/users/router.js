const { Router } = require('express');
const UserController = require('./controller');

const router = Router();

router.post('/', UserController.validateUserCreation, UserController.createUser);

router.get('/', UserController.getUsers);

router.get('/:id', UserController.validateId, UserController.getUserById);

router.patch('/:id', UserController.validateId, UserController.updateUserById);

router.delete('/:id', UserController.validateId, UserController.deleteUserById);

router.patch('/:id/add/films', UserController.validateId, UserController.validateUserAddFilm, UserController.validateAddFilm, UserController.addFilmToUser);

router.patch('/:id/remove/films', UserController.validateId, UserController.validateUserRemoveFilm, UserController.removeFilmFromUser);

module.exports = router;