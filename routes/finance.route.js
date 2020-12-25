const express = require('express');
const { body } = require('express-validator/check');

const financialController = require('../controllers/fiance.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/financial', isAuth, financialController.getListFinancial);

router.get('/financial/:id', isAuth, financialController.getFinancial);

router.post('/financial', isAuth, [
  body('desc')
    .isString()
    .trim()
    .not()
    .isEmpty(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('date')
    .isDate()
    .trim(),
  body('categoryFinancialId')
    .isInt(),
  body('paymentMethodId')
    .isInt()
], financialController.postFinancial);

router.put('/financial', isAuth, [
  body('id')
    .isInt(),
  body('desc')
    .isString()
    .trim()
    .not()
    .isEmpty(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('date')
    .isDate()
    .trim(),
  body('categoryFinancialId')
    .isInt(),
  body('paymentMethodId')
    .isInt()
], financialController.putFinancial);

router.get('/categoryfinancial', isAuth, financialController.getListCategory);

router.get('/paymentmethod', isAuth, financialController.getListPaymentMethod);

router.delete('/financial/delete', isAuth, financialController.deleteFinancial);

module.exports = router;