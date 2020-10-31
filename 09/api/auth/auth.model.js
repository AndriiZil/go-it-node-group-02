const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true, enum: ['verified', 'created'], default: 'created' },
    verificationToken: { type: String, required: false, default: '' }
});

module.exports = model('User', UserSchema);
