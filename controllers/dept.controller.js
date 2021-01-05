const { validationResult } = require('express-validator/check');

const PaymentMethod = require('../models/payment-method.model');
const Dept = require('../models/dept.model');

exports.getListDepts = async (req, res, next) => {
  try {
    const lstDepts = await req.user.getDepts({
      include: [ 'payment_method' ],
    });
    res.render('dept/list', {
      path: '/dept',
      pageTitle: "Dept",
      lstDepts
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
