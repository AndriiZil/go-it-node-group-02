const should = require('should');
const sinon = require('sinon');
const { expect } = require('chai');

const UserController = require('../users/users.controller');
const UserModel = require('../users/users.model');

function sum(a, b) {
    if (a === 1) {
        throw new Error();
    }
    return a + b;
}

describe('Unit test example', () => {

    describe('#sum', () => {
        it('should return expected result', () => {
            const result = sum(5, 3);
            result.should.be.eql(8);
        });

        it('should throw an error', () => {
            should.throws(() => sum(1, 3))
        });
    });

    describe('#check-user', () => {
        let sandbox;

        before(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it.only('should pass test', async () => {
            let findUserByEmailStub = sandbox.stub(UserModel, 'findUserByEmail').resolves('success');

            const result = await UserController.checkUser('test@gmail.com', 'password');
            expect(result).to.be.a('string');
            expect(result).to.equal('success');
            sinon.assert.calledOnce(findUserByEmailStub);
            sinon.assert.calledWithExactly(findUserByEmailStub, 'test@gmail.com');
        });

    });

});