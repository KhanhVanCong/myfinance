const express = require('express');
const { check, body } = require('express-validator/check');

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
    .isEmpty(),
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

module.exports = router;