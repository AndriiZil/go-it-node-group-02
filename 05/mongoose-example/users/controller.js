 const Joi = require('joi');
const UserModel = require('./model');
const { Types } = require('mongoose');

class UserController {

    async createUser(req, res, next) {
        try {

            const user = await UserModel.create(req.body);
            const validatedUser = UserController.validateUserResponse([user])

            return res.status(201).send(validatedUser);
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req, res, next) {
        try {

            const users = await UserModel.find();

            const preparedUsers = UserController.validateUserResponse(users);

            return res.send(preparedUsers);

        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {

            const user = await UserModel.findById(req.params.id);

            if (!user) {
                return res.status(404).send({ message: 'User was not found' });
            }

            const preparedUsers = UserController.validateUserResponse([user]);

            return res.send(preparedUsers);

        } catch(err) {
            next(err);
        }
    }

    async updateUserById(req, res, next) {
        try {

            const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!user) {
                return res.status(404).send({ message: 'User was not found' });
            }

            const preparedUsers = UserController.validateUserResponse([user]);

            return res.send(preparedUsers);
        } catch(err) {
            next(err);
        }
    }

    async deleteUserById(req, res, next) {
        try {

            const user = await UserModel.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).send({ message: 'User was not found' });
            }

            const preparedUsers = UserController.validateUserResponse([user]);

            return res.send(preparedUsers);

        } catch (err) {
            next(err);
        }
    }

    async addFilmToUser(req, res, next) {
        try {

            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
                $push: { films: req.body }
            }, { new: true });

            if (!updatedUser) {
                return res.status(404).send({ message: 'User was not found' });
            }

            const preparedUsers = UserController.validateUserResponse([updatedUser]);

            return res.send(preparedUsers);

            return res.send();
        } catch (err) {
            next(err);
        }
    }

    async removeFilmFromUser(req, res, next) {
        try {

            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
                $pull: { films: { _id: req.body.id } }
            }, { new: true });

            if (!updatedUser) {
                return res.status(404).send({ message: 'User was not found' });
            }

            const preparedUsers = UserController.validateUserResponse([updatedUser]);

            return res.send(preparedUsers);
        } catch (err) {
            next(err);
        }
    }


    static validateUserResponse(users) {
        return users.map(({ _id, name, age, email, films }) => {
            return { _id, name, age, email, films };
        })
    }

    validateUserCreation(req, res, next) {
        const validateRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            age: Joi.string(),
            password: Joi.string().required(),
            films: Joi.array().items(
                Joi.object({
                    name: Joi.string()
                })
            )
        });

        UserController.checkErrorValidation(validateRules, req, res, next);
    }

    validateUserAddFilm(req, res, next) {
        const validateRules = Joi.object({
            name: Joi.string().required()
        });

        UserController.checkErrorValidation(validateRules, req, res, next);
    }

    validateAddFilm(req, res, next) {
        const validateRules = Joi.object({
            name: Joi.string().required()
        });

        UserController.checkErrorValidation(validateRules, req, res, next);
    }

    validateUserRemoveFilm(req, res, next) {
        const validateRules = Joi.object({
            id: Joi.string().required()
        });

        UserController.checkErrorValidation(validateRules, req, res, next);
    }

    static checkErrorValidation(schema, req, res, next) {
        const { error } = schema.validate(req.body);

        if (error) {
            const { message } = error.details[0]
            return res.status(400).send({ message });
        }
        next();
    }

    validateId(req, res, next) {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ message: 'Object id is not valid.' });
        }
        next();
    }

}

module.exports = new UserController();