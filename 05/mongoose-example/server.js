const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./users/router');

require('dotenv').config();

const URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Create server
// Init middlewares
// Init routes
// Init DB
// Start listerning

class Server {

    constructor() {
        this.server = null;
    }

    async start() {
        this.initServer();
        this.initMiddlewares();
        this.initRoutes();
        await this.initDBConnection();
        this.startListening();
    }

    initServer() {
        this.server = express();
    }

    initMiddlewares() {
        this.server.use(express.json());
    }

    initRoutes() {
        this.server.use('/users', routerUser);
    }

    async initDBConnection() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true
            };

            await mongoose.connect(URL, options);

            console.log('Database was connected');
        } catch (err) {
            next(err);
        }
    }

    startListening() {
        this.server.listen(PORT, () => console.log(`Server was starter on port: ${PORT}`))
    }

}

module.exports = Server;