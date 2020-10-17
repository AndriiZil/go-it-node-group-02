const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: String, required: false },
    password: { type: String, required: true },
    films: [{
        name: { type: String, required: false }
    }]
});

module.exports = model('User', UserSchema);