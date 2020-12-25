const express = require('express');

const financialController = require('../controllers/fiancial.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/financial', isAuth, financialController.getListFinancial);

router.get('/financial/:id', isAuth, financialController.getFinancial);

router.post('/financial', isAuth, financialController.postFinancial);

router.put('/financial', isAuth, financialController.putFinancial);

router.get('/categoryfinancial', isAuth, financialController.getListCategory);

router.get('/paymentmethod', isAuth, financialController.getListPaymentMethod);

router.delete('/financial/delete', isAuth, financialController.deleteFinancial);

module.exports = router;