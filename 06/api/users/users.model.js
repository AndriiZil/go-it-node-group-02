const { Schema, model, Types: { ObjectId } } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: false },
    favouriteFilms: [{ type: ObjectId, ref: 'Film' }]
});

userSchema.statics.updateToken = updateToken;

async function updateToken(id, token) {
    return this.findByIdAndUpdate(id, {
        token
    }, { new: true });
}

module.exports = model('User', userSchema);