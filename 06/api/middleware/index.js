const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Types: { ObjectId } } = require('mongoose');

const UserModel = require('../users/users.model');

async function authorize(req, res, next) {
    
    try {
        const authorizationHeader = req.get('Authorization') || '';

        if (!authorizationHeader) {
            const error = new Error('Token was not provided');
            error.code = 401;
            throw error;
        }
    
        const token = authorizationHeader.replace('Bearer', '').trim();
    
        let userId;
        try {
            userId = await jwt.verify(token, process.env.JWT_SECRET).id;
        } catch (err) {
            next(err);
        }
    
        const user = await UserModel.findById(userId);

    
        if (!user || token !== user.token) {
            const error = new Error('User is not authorize');
            error.code = 401;
            throw error;
        }
    
        delete user.token;
    
        req.user = user;
    
        next();
    } catch (err) {
        errorHandler(err, res);
    }
}

function validateId(req, res, next) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            const error = new Error('User id is not valid.');
            error.code = 400;
            throw error;
        }
    } catch(err) {
        errorHandler(err, res);
    }

    next();
}

function validateUserCreate(req, res, next) {
    try {
        const rulesSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        });

        checkErrorValidation(rulesSchema, req);

        next();
    } catch(err) {
        errorHandler(err, res);
    }
}

function validateSighInUser(req, res, next) {
    try {
        const rulesSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        });

        checkErrorValidation(rulesSchema, req);

        next();
    } catch(err) {
        errorHandler(err, res);
    }
}

function errorHandler(err, res) {
    if (err) {
        const status = err.status || err.code || 500;
        const message = err.message || 'Error';

        res.status(status).send({ message })
    }
}

function checkErrorValidation(rules, req) {
    const { error } = rules.validate(req.body);

    if (error) {
        const { message } = error.details[0];
        const err = new Error(message);
        err.code = 400;
        throw err;
    }
}

module.exports = {
    authorize,
    validateId,
    validateUserCreate,
    validateSighInUser
}