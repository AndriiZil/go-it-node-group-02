const { Router } = require('express');
const FilmsController = require('./films.controller');

const router = Router();

// router.get('/', (req, res, next) => res.send('ok'));

router.post('/', FilmsController.createFilm);

router.get('/', FilmsController.getFilms);

module.exports = router;