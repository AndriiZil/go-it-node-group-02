const express =require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const usersRoutes = require('./users/users.routes');

class Server {

  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    await this.initDb();
    return this.startlistening(); // return for test
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(logger('dev'));
  }

  initRoutes() {
    this.server.use('/auth', usersRoutes);
  }

  async initDb() {
    try {
      await mongoose.connect('mongodb+srv://admin:qwerty12345@cluster0.o6ql3.mongodb.net/test_db?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      console.log('Database Connected');
    } catch (err) {
      console.log(err);
    }
  }

  startlistening() {
    return this.server.listen(3000, () => console.log('Server was started.')); // return for tests
  }

}

module.exports = Server;
