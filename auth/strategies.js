const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require('connect-flash-plus');
const {User} = require('../models/models');


// local passport strategy for logging in 

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  }, 
  function verify(username, password, done) {
    let user;
    User
      .findOne({username: username})
      .exec()
      .then(_user => {
        user = _user;
        if (!user) {
          return done(null, false);
        }
        return user.validatePassword(password);
      })
      .then(isValid => {
        if (!isValid) {
          return done(null, false);
        }
        else {
          return done(null, user);
        }
      })   
      .catch(err => done(err)); 
  }
));

// passport session setup - required for persistent login sessions
// used to seralize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
