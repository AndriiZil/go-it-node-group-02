const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env')});

const authRouter = require('./auth/auth.router');

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
        this.server.use('/auth', authRouter);
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
