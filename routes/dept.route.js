const express = require('express');
const { body } = require('express-validator/check');

const deptController = require('../controllers/dept.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dept', isAuth, deptController.getListDepts);

router.get('/dept/:id', isAuth, deptController.getDept);

router.get('/dept/detail/:id', isAuth, deptController.getDeptDetail);

router.post('/dept', isAuth, [
  body('creditor')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('desc')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('dateOfBorrow')
    .isDate()
    .trim(),
  body('lendingRate')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('dueDate')
    .isDate()
    .trim(),
  body('paymentMethodId')
    .isInt()
], deptController.postDept);

router.put('/dept', isAuth, [
  body('id')
    .isInt(),
  body('creditor')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('desc')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('money')
    .isFloat()
    .not()
    .isEmpty(),
  body('dateOfBorrow')
    .isDate()
    .trim(),
  body('lendingRate')
    .isString()
    .trim()
    .not()
    .isEmpty()
    .escape(),
  body('dueDate')
    .isDate()
    .trim(),
  body('paymentMethodId')
    .isInt()
], deptController.putDept);

router.delete('/dept', isAuth, deptController.deleteDept);

module.exports = router;