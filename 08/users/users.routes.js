const { Router } = require('express');
const UsersController = require('./users.controller');

const router = Router();

router.post('/', UsersController.validateUserCreate, UsersController.createUser);

router.get('/current', UsersController.authorize, UsersController.getCurrentUser);

router.get('/', UsersController.getUsers);

router.delete('/films/favourites', UsersController.authorize, UsersController.removeFilmFromUser);

router.patch('/films/favourites/:id', UsersController.authorize, UsersController.validateId, UsersController.addFilmForUser);

router.put('/sign-in', UsersController.validateSignIn, UsersController.signIn);

router.patch('/logout', UsersController.authorize, UsersController.logout);

module.exports = router;
