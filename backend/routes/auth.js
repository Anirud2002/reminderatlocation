const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
    console.log(profile)
}))

router.get('/login', passport.authenticate('google'))
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

module.exports = router