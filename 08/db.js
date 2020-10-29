const mongoose = require('mongoose');

async function initDbConnection() {
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

module.exports = initDbConnection;