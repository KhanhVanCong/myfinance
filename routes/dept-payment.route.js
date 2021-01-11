const express = require('express');
const { body } = require('express-validator/check');

const deptPaymentController = require('../controllers/dept-payment.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/deptpayment/:id', isAuth, deptPaymentController.getDeptPayment);

router.post('/deptpayment', isAuth, [
  body('deptId')
    .isInt(),
  body('note')
    .isString()
    .trim()
    .escape(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('date')
    .isDate()
    .trim(),
  body('paymentMethodId')
    .isInt()
], deptPaymentController.postDeptPayment);

router.put('/deptpayment', isAuth, [
  body('deptId')
    .isInt(),
  body('paymentId')
    .isInt(),
  body('note')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('date')
    .isDate()
    .trim(),
  body('paymentMethodId')
    .isInt()
], deptPaymentController.putDeptPayment);

router.delete('/deptpayment', isAuth, deptPaymentController.deleteDeptPayment);

module.exports = router;