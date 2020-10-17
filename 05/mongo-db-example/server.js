const express = require('express');
const logger = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(logger('dev'));
app.use(express.json());

const dbName = 'users_test';
const URL = `mongodb+srv://test_user:qwerty12345@cluster0.0n4wc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

let usersCollection;
let db;

connectToDb();

app.post('/', async (req, res, next) => {
    try {
        // console.log(req.body);
        const newUser = await usersCollection.insertOne(req.body);

        return res.status(201).send(newUser);
    } catch (err) {
        next(err);
    }
})

app.get('/', async (req, res, next) => {
    try {

        const users = await usersCollection.find().toArray();
        const validatedUsers = validateResponseUser(users);

        return res.send(validatedUsers);
    } catch (err) {
        next(err);
    }
})

app.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Object id is not valid' });
        }

        const user = await usersCollection.findOne({ _id: ObjectId(userId) });
        const validatedUsers = validateResponseUser([user]);

        if (!user) {
            return res.status(404).send({ message: 'User was not found' });
        }

        return res.send(validatedUsers);
    } catch (err) {
        next(err);
    }
})

app.patch('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Object id is not valid' });
        }

        const { modifiedCount } = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: req.body });

        if (!modifiedCount) {
            return res.status(400).send({ message: 'User was not updated' });
        }

        return res.send({ message: 'User was updated' });

    } catch (err) {
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Object id is not valid' });
        }

        const { deletedCount } = await usersCollection.deleteOne({ _id: ObjectId(userId )});

        if (!deletedCount) {
            return res.status(400).send({ message: 'User was not deleted' });
        }

        return res.send({ message: 'User was deleted' });
    } catch (err) {
        next(err);
    }
})

app.listen(3000, () => console.log('Server was started.'));

// DB Connection
async function connectToDb() {

    try {

        const client = await MongoClient.connect(URL, { useUnifiedTopology: true });

        db = client.db(dbName);
        usersCollection = db.collection('users');

        console.log('Database connected!');

    } catch (err) {
        console.log(err);
    }

}

function validateResponseUser(users) {
    return users.map(({ _id, name, email }) => {
        return {
            _id,
            name,
            email
        }
    });
}