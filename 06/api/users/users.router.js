const { Router } = require('express');

const UserController = require('./users.controller');
const { authorize, validateId, validateUserCreate, validateSighInUser } = require('../middleware');

const router = Router();

// router.get('/', (req, res, next) => res.send('ok'));

router.post('/', validateUserCreate, UserController.createUser);

router.put('/sign-in', validateSighInUser, UserController.signIn);

router.get('/', authorize, UserController.getUsers);

router.put('/logout', authorize, UserController.logout);

router.get('/current', authorize, UserController.getCurrentUser);

router.get('/aggregate', authorize, UserController.getFilmsForUserWithAggregate);

router.get('/populate', authorize, UserController.getFilmsForUserWithPopulate);

router.get('/:id', validateId, authorize, UserController.getUserById);

router.put('/:id/addFilm', validateId, authorize, UserController.createFilmForUser);

router.put('/:id/removeFilm', validateId, authorize, UserController.removeFilmForUser);

module.exports = router;