const User = require('./users.model');
const bcryptjs = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Types: { ObjectId } } = require('mongoose');

const { UnauthorizedError, NotFoundError } = require('../helper/errors');

class UsersController {

  constructor() {
    this.costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  async getUsers(req, res, next) {
    try {
      const users = await User.find();

      const preparedUsers = UsersController.prepareUserResponse(users);

      return res.send(preparedUsers);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const [ userForResponse ] = UsersController.prepareUserResponse([req.user]);

      return res.send(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  async _createUser(req, res, next) {
    try {
      const { password, email, userName } = req.body;
      const passwordHash = await bcryptjs.hash(password, this.costFactor);

      const existingUser = await User.findUserByEmail(email); // later

      if (existingUser) {
        return res.status(409).send({ message: 'User already exists.' }); // later
      }

      const user = await User.create({
        userName,
        email,
        password: passwordHash
      });

      return res.status(201).send({
        id: user._id,
        username: user.userName,
        email: user.email
      });
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError('Authentication failed.');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Authentication failed.');
      }

      const token = await jwt.sign({ id: user._id }, 'secret', {
        expiresIn: 2 * 24 * 60 * 60 // two days
      });

      const updatedUser = await User.updateToken(user._id, token);

      return res.send(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async addFilmForUser(req, res, next) {
    try {
      const filmId = req.params.id;

      const film = await FilmModel.findById(filmId);

      if (!film) {
        throw new NotFoundError('Film does not exists.');
      }

      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        $push: { favouriteFilmIds: filmId }
      }, { new: true });

      const [preparedUserForResponse] = UsersController.prepareUserResponse([updatedUser]);

      return res.send(preparedUserForResponse);
    } catch (err) {
      next(err);
    }
  }

  async removeFilmFromUser(req, res, next) {
    try {
      const filmId = req.params.id;

      // await User.findByIdAndUpdate(req.user.id, {
      //   $pull: { favouriteFilmIds: filmId }
      // }, { new: true });

      const usersWithFilms = await User.aggregate([
        { $match: { _id: req.user._id } },
        {
          $lookup: {
            from: 'films',
            localField: 'favouriteFilmIds',
            foreignField: '_id',
            as: 'films',
          }
        }
      ]);

      const preparedUserForResponse = UsersController.prepareUserResponse(usersWithFilms);

      return res.send(preparedUserForResponse);
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.replace('Bearer', '').trim();

      let userId;
      try {
        userId = await jwt.verify(token, 'secret').id;
      } catch (err) {
        next(err);
      }

      const user = await User.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError('User not authorized.');
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;

      await User.updateToken(user._id, null);

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  validateUserCreate(req, res, next) {
    const createUserRules = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().required(),
      userName: Joi.string().required()
    });

    UsersController.checkErrorValidation(createUserRules, req, res, next);
  }

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    });

    UsersController.checkErrorValidation(signInRules, req, res, next);
  }

  static checkErrorValidation(schema, req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      const { message } = error.details[0];
      return res.status(422).send({ error: message });
    }
    next();
  }

  static prepareUserResponse(users) {
    return users.map(({ _id, userName, email, favouriteFilmIds, films }) => {
      return {
        _id, userName, email, favouriteFilmIds, films
      }
    })
  }

  validateId(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: 'Not valid id' });
    }
    next();
  }

}

module.exports = new UsersController();
