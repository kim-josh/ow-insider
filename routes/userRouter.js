const express = require('express');
const faker = require('faker');
const passport = require('passport');
const path = require('path');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../models/models');

userRouter.use(jsonParser);

function generateLibraryId() {
  return faker.random.number() + faker.random.number() + faker.random.number();
}

// Returns user info 
userRouter.get('/me', authorize, (req, res) => {
  res.json({user: req.user.userRepr()});
});


// Profile section - will use isLoggedIn middleware to make this endpoint protected
userRouter.get('/:username', (req, res) => {
  User
    .findOne({username: req.params.username})
    .exec()
    .then(user => {
      res.status(200).json({
        user: user.userRepr(),
        redirect: '/'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

userRouter.post('/username', (req, res) => {
	let {username} = req.body;
	return User
		.find({username})
		.count()
		.exec()
		.then(count => {
			if (count > 0){
				return res.json({message: 'Username has already been used to create an account'});
			}
			else {
				return res.json({message: 'Success. Time to own some noobs!'});
			}
		});
});

// POST route to register a new user
userRouter.post('/signup', jsonParser, (req, res) => {
  // Ensure that email, username and password are defined 
  const requiredFields = ['email', 'username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  // Ensure that all 4 fields are strings
  const stringFields = ['email', 'username', 'password'];
  const nonStringField = stringFields.find(field => 
    (field in req.body) && typeof req.body[field] !== 'string'
  );
  if (nonStringField) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: 'Field must be a string',
      location: nonStringField
    });
  }

  // Ensure that the email, username and password don't start or end w/ whitespace
  const trimmedFields = ['email', 'username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => 
    req.body[field] !== req.body[field].trim()
  );
  if (nonTrimmedField) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  // Ensure that there is no existing username or email 
  let {email, username, password, joinDate, libraryId} = req.body;
  // Check for email first
  return User
    .find({email})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        // Reject if the username is taken
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'An account is already registered with this email',
          location: 'email'
        });
      }
    })
    .then(() => {
      return User
        .find({username})
        .count()
        .exec()
    })
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'This username is already taken',
          location: 'username'
        });
      }
      // If there is no user, we hash the password
      return User.hashPassword(password);      
    })
    .then(hash => {
      return User.create({
        email: email,
        username: username,
        password: hash,
        joinDate: joinDate || Date.now(),
        libraryId: libraryId || generateLibraryId()
      });
    })
    .then(user => {
      return res.status(201).json({redirect: '/', user: user.userRepr()});
    })
    .catch(err => {
      // Forward validation errors on to the client
      console.error(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({message: 'Internal server error'});
    });
});

// PUT route to update password  
userRouter.put('/:id', (req, res) => {
  if (!('password' in req.body)) {
    const message = `Missing password in request body`;
    console.error(error);
    return res.status(422).send(message);
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id} and` + 
      `request body id (${req.body.id} must match each other`;
    console.error(message);
    return res.status(422).send(message);
  }
  const updateField = {}; // Add password as a field to this empty object 
  if ('password' in req.body) {
    updateField.password = req.body.password;
  }
  // Hash the password if it exists in the req body 
  if (updateField.password !== undefined) {  
  return User
    .findById(req.params.id)
    .exec()
    .then(user => {
      return User.hashPassword(updateField.password);
    })
    .then(hash => {
      updateField.password = hash;
      return updateField;
    })
    .then(() => {
      User
        .findByIdAndUpdate(req.params.id, {$set: updateField}, {new: true})
        .exec()
        .then(updatedUser => res.status(200).json({message: 'Updated user successfully', user: updatedUser.userRepr()}))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
    });
  }  
});

// DELETE route to delete user
userRouter.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted user account ${req.params.id}`);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({code: 500, message: 'Internal server error'}));
});

// middleware to make sure a user is logged in
function authorize(req, res, next) {
  if (req.user !== undefined) {
    next()
  } else {
    res.status(403).send('Forbidden Access');
  }
}


module.exports = userRouter;