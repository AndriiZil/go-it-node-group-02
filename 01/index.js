const func = require('./app');

console.log(global.variable);

const envTest = process.env.USER_DB_CONFIGURATION;
console.log(envTest);

require('./console');
require('./console');