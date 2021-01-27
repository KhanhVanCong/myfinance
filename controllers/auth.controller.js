const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user.model');
const { validationResult } = require('express-validator/check');
const { Op } = require('sequelize');
const { getMessageFlash } = require('../util/common-function');

const { SENDGRID_API_KEY } = process.env;
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY
  }
}));

exports.getLogin = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  const successMessage = getMessageFlash(req, 'successMessage');
  res.render('auth/login', {
    path: '/login',
    pageTitle: "Login",
    errorMessage: null,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: [],
    successMessage
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422)
              .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: { email, password },
                validationErrors: errors.array(),
                successMessage: null
              })
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(422)
                .render('auth/login', {
                  path: '/login',
                  pageTitle: 'Login',
                  errorMessage: 'Invalid email or password.',
                  oldInput: { email, password },
                  validationErrors: [ { param: 'email', params: 'password' } ],
                  successMessage: null
                })
    } else {
      try {
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
          req.session.user = user;
          return req.session.save(err => {
            res.redirect('/');
          })
        } else {
          return res.status(422)
                    .render('auth/login', {
                      path: '/login',
                      pageTitle: 'Login',
                      errorMessage: 'Invalid email or password.',
                      oldInput: { email, password },
                      validationErrors: [ { param: 'email', params: 'password' } ],
                      successMessage: null
                    })
        }
      } catch (err) {
        return res.redirect('/login');
      }
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: "Signup",
    errorMessage: null,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
              .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: { name, email, password, confirmPassword },
                validationErrors: errors.array()
              });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashPassword });
    req.flash('successMessage', 'Account successfully created!')
    res.redirect('/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getReset = (req, res, next) => {
  const message = getMessageFlash(req, 'error');
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString('hex');
    const { email } = req.body;
    const user = await User.findOne({
      where: { email }
    });
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      const host = req.protocol + '://' + req.get('host');
      await transporter.sendMail({
        to: user.email,
        from: 'pysyren@gmail.com',
        subject: 'Password Reset',
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href='${ host }/reset/${ token }'>link</a> to set a new password.</p>
          `
      });
      req.flash('successMessage', 'Please check your email to reset password!');
      res.redirect('/');
    } else {
      throw new Error('Not found email in system!')
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/reset');
  }
}

exports.getNewPassword = async (req, res, next) => {
  try {
    const errorMessage = getMessageFlash(req, 'errorNewPassword');
    const resetToken = req.params.token;
    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpiration: {
          [Op.gt]: Date.now()
        }
      }
    })
    if (user) {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Change New Password',
        userId: user.id,
        passwordToken: resetToken,
        errorMessage
      })
    } else {
      throw new Error('Not Found!');
    }

  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/reset');
  }
}

exports.postNewPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { resetToken, userId, currentPassword, newPassword } = req.body;
    const user = await User.findOne({
      where: {
        resetToken,
        id: userId,
        resetTokenExpiration: {
          [Op.gt]: Date.now()
        }
      }
    })
    if (user) {
      const doMatch = await bcrypt.compare(currentPassword, user.password);
      if (doMatch) {
        const hashPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();
        req.flash('successMessage', 'Reset Password Success!')
        res.redirect('/login');
      } else {
        throw new Error('Current Password not match!');
      }
    } else {
      throw new Error('Not Found!');
    }

  } catch (e) {
    const url = "/reset/" + req.body.resetToken;
    req.flash('errorNewPassword', e.message);
    return res.redirect(url);
  }
}

exports.loginThirdParty = async (req, res, next) => {
  try {
    console.log('go login');
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(422)
                .render('auth/login', {
                  path: '/login',
                  pageTitle: 'Login',
                  errorMessage: 'Login failed !!!.',
                  oldInput: { email : '', password: '' },
                  validationErrors: [ { param: 'email', params: 'password' } ],
                  successMessage: null
                })
    } else {
      req.session.user = user;
      req.session.save(err => {
        res.redirect('/');
      })
    }
  } catch (e) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}
