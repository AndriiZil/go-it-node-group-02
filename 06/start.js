const Server = require('./server');

new Server().start().catch(e => console.log(e));