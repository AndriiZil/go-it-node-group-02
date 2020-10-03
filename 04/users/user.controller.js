const Joi = require('joi');

const users = [
    { id: 1, name: 'Bogdan', email: 'bogdan@gmail.com', password: '12345' },
    { id: 2, name: 'Ira', email: 'ira@gmail.com', password: '12345' },
    { id: 3, name: 'Igor', email: 'igor@gmail.com', password: '12345' }
];

class UserController {

    getUsers(req, res, next) {
        try {
            res.send(users);
        } catch (err) {
            next(err);
        }
    }

    createUser(req, res, next) {
        try {
            users.push({
                id: users.length + 1,
                ...req.body
            });

            res.send({ message: 'success' });
        } catch (err) {
            next(err);
        }
    }

    updateUser(req, res, next) {
        try {
            const targetIndex = UserController.findIndexById(req.params.id, res);

            users[targetIndex] = {
                ...users[targetIndex],
                ...req.body
            }

            res.send({ message: 'success' });

        } catch (err) {
            next(err);
        }
    }

    deleteUser(req, res, next) {
        try {
            const targetIndex = UserController.findIndexById(req.params.id, res);

            users.splice(targetIndex, 1);

            res.send({ message: 'success' });
        } catch (err) {
            next(err);
        }
    }

    static findIndexById(userId, res) {
        const id = parseInt(userId);

        const targetIndex = users.findIndex(user => user.id === id);

        if (targetIndex === -1) {
            return res.status(400).send('User not found.');
        }

        return targetIndex;
    }

    validateCreateUser(req, res, next) {
        const validateCreateUserSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        });

        const { error } = validateCreateUserSchema.validate(req.body);

        if (error) {
            const { message } = error.details[0];
            return res.status(400).send({ message });
        }
        next();
    }

    validateUpdateUser(req, res, next) {

        console.log(req.params);

        const validateUpdateUserSchema = Joi.object({
            email: Joi.string(),
            password: Joi.string()
        });

        const { error } = validateUpdateUserSchema.validate(req.body);

        if (error) {
            const { message } = error.details[0];
            return res.status(400).send({ message });
        }
        next();
    }

}

module.exports = new UserController();