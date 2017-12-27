const express = require('express');
const passport = require('passport');
const authRouter = express.Router();


// Process the login form 
authRouter.post('/login', function handleLocalAuthentication(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.redirect('/404');
    }
    // this establishes a session and sends a response
    req.login(user, function(err) {
      if (err) {return next(err);}
      return res.redirect('/profile');
    });
  })(req, res, next);
});

module.exports = authRouter;