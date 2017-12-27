const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const should = chai.should();
const {User} = require('../models/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// Adds 10 user docs to test-db so that we have test data to work with/assert about
function seedUserData() {
    console.info('seeding user data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    // Returns a promise
    return User.insertMany(seedData);
}

function generateUserData() {
    return {
        email: generateEmail(),
        username: generateUsername(),
        password: generatePassword(),
        joinDate: generateDate(),
        libraryId: generateLibraryId()
    };
}

function generateEmail() {
    return faker.internet.email();
}

function generateUsername() {
    return faker.internet.userName();
}

function generatePassword() {
    return faker.internet.password();
}

function generateDate(){
    return faker.date.past();
}

function generateLibraryId() {
    return faker.random.number() + faker.random.number() + faker.random.number();
}

// This function deletes the entire db - ensures that all tests are independent
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Users API resource', () => {
    before(function() {
        console.info(`Connecting to ${TEST_DATABASE_URL}`);
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return seedUserData();
    });
    afterEach(function() {
        return tearDownDb();
    });
    after(function() {
        return closeServer();
    });

    describe('GET endpoint', () => {
        it('Should return specified user', () => {
            // Get back user specified by /:username
            // Res should have right status, data type
            let res;
            return User
                .findOne()
                .exec()
                .then((user) => {                                  
                    return chai.request(app)
                    .get(`/users/${user.username}`)
                    .then(_res => {
                        res = _res;
                        let user = res.body.user;
                        res.should.have.status(200);
                        res.should.be.json;
                        user.id.should.be.a('string');
                        user.email.should.be.a('string');
                        user.joinDate.should.be.a('string');
                        user.libraryId.should.be.a('string');
                    });
                });
        });
        it('Should reject unauthorized users', () => {
            return chai.request(app)
                .get('/users/me')
                .then(res => {
                    return res;
                })
                .catch(err => {
                    err.should.have.status(403);
                    err.should.be.equal('Forbidden');
                });
        });
    });

    describe('POST endpoint', () => {
        it('Should create a new user', () => {
            let newUser = {
                email: generateEmail(),
                username: generateUsername(),
                password: generatePassword(),
                joinDate: generateDate(),
                libraryId: generateLibraryId()
            };
            return chai.request(app)
                .post('/users/signup')
                .send(newUser)
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.user.should.be.a('object');
                    res.body.user.should.include.keys('email', 'username', 'joinDate', 'libraryId');
                    res.body.user.email.should.be.a('string');
                    res.body.user.username.should.a('string');
                    res.body.user.joinDate.should.a('string');
                    res.body.user.libraryId.should.a('string');
                });
        });
    });

    describe('PUT endpoint', () => {
        it('Should update password', () => {
            const updateData = {
                password: 'joejoewhojoe'
            };
            return User
                .findOne()
                .exec()
                .then((user) => {
                    updateData.id = user.id;
                    return chai.request(app)
                        .put(`/users/${user.id}`)
                        .send(updateData);
                })
                .then((res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.user.id.should.equal(updateData.id);
                });
        });
    });
});

    /* Will implement if I add this feature in the future
    describe('DELETE endpoint', () => {
        it('Should delete user by id', (req, res) => {            
            let user;
            return User
                .findOne()
                .exec()
                .then((_user) => {
                    user = _user;
                    return chai.request(app)
                        .delete(`/users/${user.id}`);                    
                })
                .then((res) => {
                    res.should.have.status(204);
                    return User.findById(user.id);
                })
                .then((_user) => {
                    // When value is null, should.be.null would raise an error. 
                    should.not.exist(_user);
                });
        });
    });
    */

