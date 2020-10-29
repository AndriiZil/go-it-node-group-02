const request = require('supertest');
const should = require('should');

const UserServer = require('../server');
const UserModel = require('../users/users.model');

describe('Acceptance tests suitcase example', () => {
    let server;

    before(async () => {
        const userServer = new UserServer();
        server = await userServer.start();
    });

    after(() => {
        server.close();
    });

    describe('POST /auth', () => {

        it('should return status 422 error', async () => {
            await request(server)
                .post('/auth')
                .set('Content-Type', 'application/json')
                .send({})
                .expect(422);
        });

        context('when user with such id exists', () => {
            const existingEmail = 'existing@email.com';
            let userDoc;

            before(async () => {
                userDoc = await UserModel.create({
                    userName: 'test',
                    email: existingEmail,
                    password: 'password_hash'
                });
            });

            after(async () => {
                await UserModel.findByIdAndDelete(userDoc._id);
            });

            it('should return status 409 error', async () => {
                await request(server)
                    .post('/auth')
                    .set('Content-Type', 'application/json')
                    .send({
                        userName: 'test',
                        email: existingEmail,
                        password: 'password_hash'
                    })
                    .expect(409);
            });

        });

        context('Successfully created user', () => {
            const existingEmail = 'existing@email.com';

            before(async () => {
                await UserModel.deleteMany();
            });

            after(async () => {
                await UserModel.deleteMany();
            });

            it('should return status 201 error', async () => {
                const response = await request(server)
                    .post('/auth')
                    .set('Content-Type', 'application/json')
                    .send({
                        userName: 'test',
                        email: existingEmail,
                        password: 'password_hash'
                    })
                    .expect(201);

                const responseBody = response.body;

                should.exist(response.body);
                responseBody.should.have.property('id').which.is.a.String();
                responseBody.should.have.property('username').which.is.a.String();
                responseBody.should.have.property('email').which.is.a.String();
                responseBody.should.not.have.property('password');
            });

        })

    });

});