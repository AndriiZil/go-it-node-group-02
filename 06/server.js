const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const usersRouter = require('./api/users/users.router');
const filmsRouter = require('./api/films/films.router');

class Server {

    constructor() {
        this.server = null;
    }

    async start() {
        this.initServer();
        this.initMiddleware();
        this.initRoutes();
        await this.initDbConnection();
        this.startListening();
    }

    initServer() {
        this.server = express();
    }

    initMiddleware() {
        this.server.use(express.json());
        this.server.use(logger('dev'));
    }

    initRoutes() {
        this.server.use('/users', usersRouter);
        this.server.use('/films', filmsRouter);
    }

    async initDbConnection() {
        try {
            mongoose.set('debug', true);

            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.log('Db connected.');
        } catch (err) {
            console.log(err);
        }
    }

    startListening() {
        this.server.listen(process.env.PORT, () => console.log('Server was started.'));
    }

}

module.exports = Server;