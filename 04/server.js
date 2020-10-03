const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const users = require('./users/user.router');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

module.exports = class Server {

    constructor() {
        this.server = null;
    }

    start() {
        this.initServer();
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandler();
        this.startlisterning();
    }

    initServer() {
        this.server = express();
    }

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(cors());
        this.server.use(logger('dev'));
    }

    initRoutes() {
        this.server.use('/users', users);
    }

    initErrorHandler() {

    }

    startlisterning() {
        this.server.listen(
            PORT,
            () => console.log(`Server was started on port: ${PORT}`)
        )
    }

}
