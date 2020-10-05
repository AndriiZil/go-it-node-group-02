const express = require('express');
const logger = require('morgan');
const axios = require('axios');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const {
    validateQueryParams,
    allowOriginHeader,
    addCorsHeaders
} = require('./middleware');

require('dotenv').config();

const app = express();

app.use(logger('dev'));

// app.use(allowOriginHeader);
// app.use(addCorsHeaders);

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/test', (req, res, next) => {
    console.log('QUERY PARAMS', req.query);
    res.send({ message: "Hello Express" });
});

app.get('/express-test', (req, res, next) => {
    res.send({ message: "Express" });
});

app.get('/weather', validateQueryParams, async (req, res, next) => {
    try {
        const { city } = req.query;
        const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY_API}`;

        const { data } = await axios.get(URL);

        res.json(data);
    } catch (err) {
        if (err.isAxiosError) {
            const { cod, message } = err.response.data;
            return res.status(cod).send({ message });
        }
        next(err);
    }
});

// console.log(process.env);

app.listen(PORT, () => console.log(`Server was sterted on port ${PORT}`));