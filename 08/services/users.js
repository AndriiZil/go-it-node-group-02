const UserModel = require('../user.model');

module.exports = {
    createNewUser: async function createNewUser(body) {
        const user = await UserModel.findOne({ email: body.email });
    
        if (user) {
            const error = new Error('User already exist');
            error.code = 422;
            throw error;
        }
    
        const newUser = await UserModel.create(body);
    
        return newUser;
    },
    getAllUsers: async function() {
        const users = await UserModel.find();
        return users;
    }
}