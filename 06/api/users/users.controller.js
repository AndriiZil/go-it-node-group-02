const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('./users.model');
const FilmModel = require('../films/films.model');

class UserController {

    async createUser(req, res, next) {
        try {
            const { name, email, password } = req.body;

            const passwordHash = await bcryptjs.hash(String(password), 8);

            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                return res.status(400).send({ message: 'User already exists' });
            }

            const user = await UserModel.create({
                name,
                email,
                password: passwordHash
            });

            return res.status(201).send({
                id: user._id,
                name: user.name,
                email: user.email
            });
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });


            if (!user) {
                return res.status(400).send({ message: 'User does not exist' });
            }

            const isPasswordValid = await bcryptjs.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Authentication failed' });
            }

            const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // await UserModel.findByIdAndUpdate(user._id, { token });
            await UserModel.updateToken(user._id, token);

            return res.send({
                email,
                token
            });
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserModel.find().select('-password -__v');

            res.send(users);
        } catch(err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const userId = req.user._id;

            await UserModel.findByIdAndUpdate(userId, {
                token: null
            })

            return res.status(204).end();
        } catch(err) {
            next(err);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const user = req.user;
            const preparedUser = UserController.prepareUserResponce([user]);

            return res.send(preparedUser);
        } catch(err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await UserModel.findById(userId).select('-password -__v');

            return res.send(user);
        } catch(err) {
            next(err);
        }
    }

    async createFilmForUser(req, res, next) {
        try {
            const filmId = req.params.id;

            const film = await FilmModel.findById(filmId);

            if (!film) {
                throw new Error('Film was not found');
            }

            const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, {
                $push: { favouriteFilms: filmId }
            }, { new: true });

            const preparedUser = UserController.prepareUserResponce([updatedUser]);

            return res.send(preparedUser);
        } catch(err) {
            next(err);
        }
    }

    async removeFilmForUser(req, res, next) {
        try {
            const filmId = req.params.id;

            const film = await FilmModel.findById(filmId);

            if (!film) {
                throw new Error('Film was not found');
            }

            const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, {
                $pull: { favouriteFilms: filmId }
            }, { new: true });

            const preparedUser = UserController.prepareUserResponce([updatedUser]);

            return res.send(preparedUser);

        } catch(err) {
            next(err);
        }
    }

    async getFilmsForUserWithAggregate(req, res, next) {
        try {
            const usersWithFilms = await UserModel.aggregate([
                { $match: { _id: req.user._id } },
                {
                    $lookup: {
                        from: 'films',
                        localField: 'favouriteFilms',
                        foreignField: '_id',
                        as: 'films'
                    }
                }
            ]);

            const preaperdUsers = UserController.prepareUserResponce(usersWithFilms);

            return res.send(preaperdUsers);
        } catch(err) {
            next(err);
        }
    }

    async getFilmsForUserWithPopulate(req, res, next) {
        try {

            const populatedUserWithFilms = await UserModel.find({ _id: req.user._id }).populate('favouriteFilms');

            const preaperdUsers = UserController.prepareUserResponce(populatedUserWithFilms);

            return res.send(preaperdUsers);
        } catch(err) {
            next(err);
        }
    }

    static prepareUserResponce(users) {
        return users.map(({ name, email, token, favouriteFilms, films}) => {
            return {
                token,
                name,
                email,
                favouriteFilms,
                films
            }
        });
    }

}

module.exports = new UserController();