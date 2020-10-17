const FilmModel = require('./films.model');

class FilmController {

    async createFilm(req, res, next) {
        try {
            const film = await FilmModel.create(req.body);

            return res.send(film);
        } catch(err) {
            next(err);
        }
    }

    async getFilms(req, res, next) {
        try {
            const { sort, skip, limit } = req.query;

            const films = await FilmModel.find()
                .sort(sort ? { name: parseInt(sort) } : { name: 1 })
                .skip(skip ? parseInt(skip) : 0)
                .limit(limit ? parseInt(limit) : 0)
            
            return res.send(films);
        } catch(err) {
            next(err);
        }
    }

}

module.exports = new FilmController();