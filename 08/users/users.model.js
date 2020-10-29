const { Schema, model, Types: { ObjectId } } = require('mongoose');

const UserSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  token: { type: String, required: false },
  favouriteFilmIds: [{ type: ObjectId }]
});

UserSchema.statics.findUserByEmail = findUserByEmail
UserSchema.statics.updateToken = updateToken

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, token) {
  return this.findByIdAndUpdate(id, {
    token
  }, { new: true })
}

// auth
module.exports = model('User', UserSchema);
