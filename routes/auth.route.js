const express = require('express');
const { check, body } = require('express-validator/check');
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/, 'i')
      .trim()
  ]
  , authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((email, { req }) => {
      return User.findOne({ where: { email } })
                 .then(userDoc => {
                   if (userDoc) {
                     return Promise.reject('Email exists already, please pick a different one.');
                   }
                 })
    })
    .normalizeEmail(),
  body('name', 'Please enter a name')
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('password', 'Please enter a password with only numbers and text and special character and at least 8 characters.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/, 'i')
    .trim(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password have to match!');
      }
      return true;
    }),
  authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()
    .not()
    .isEmpty() ], authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', [
  body('currentPassword')
    .isString()
    .not()
    .isEmpty(),
  body('newPassword', 'Please enter a password with only numbers and text and special character and at least 8 characters.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/, 'i')
    .trim(),
  body('confirmNewPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password have to match!');
      }
      return true;
    }) ], authController.postNewPassword);


router.get('/auth/google', passport.authenticate('google', {
    scope: [ 'profile', 'email' ]
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.loginThirdParty);

router.get('/auth/facebook', passport.authenticate('facebook', {
    callbackURL: '/auth/facebook/callback',
    scope: [ 'email' ]
  })
);

router.get('/auth/facebook/callback',
  function(req,res,next) {
    const host = 'https' + '://' + req.get('host');
    passport.authenticate('facebook', {
      callbackURL: `${host}/auth/facebook/callback`,
      failureRedirect: '/login' }) (req,res,next);
  },
  authController.loginThirdParty);

module.exports = router;