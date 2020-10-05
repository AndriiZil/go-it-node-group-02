const Joi = require('joi');

function validateQueryParams(req, res, next) {
    // const { city } = req.query;

    // if (!city) {
    //     return res.status(400).send({ message: 'City is required.' });
    // }

    const validateQuerySchema = Joi.object({
        city: Joi.string().required(),
        country: Joi.string()
    });

    const { error } = validateQuerySchema.validate(req.query);

    if (error) {
        const { message } = error.details[0];
        return res.status(400).send({ message });
    }

    next();
}

function allowOriginHeader(req, res, next) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
}

function addCorsHeaders(req, res, next) {
    res.set('Access-Control-Allow-Methods', req.headers['access-control-allow-headers']);
    res.set('Access-Control-Allow-Headers', req.headers['access-control-allow-headers']);
    next();
}

module.exports = {
    validateQueryParams,
    allowOriginHeader,
    addCorsHeaders
};