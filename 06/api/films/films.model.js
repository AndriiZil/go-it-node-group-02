const { Schema, model } = require('mongoose');

const filmSchema = new Schema({
    name: { type: String, required: true },
    genre: { type: String, required: true }
});

module.exports = model('Film', filmSchema);