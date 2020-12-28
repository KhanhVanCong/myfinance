const express = require('express');
const { body } = require('express-validator/check');

const investController = require('../controllers/invest.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/categoryinvest', isAuth, investController.getListCategoryInvest);

router.get('/categoryterm', isAuth, investController.getListCategoryTerm);

router.get('/invest/:id', isAuth, investController.getInvest);

router.get('/invest', isAuth, investController.getListInvest);

router.post('/invest', isAuth, investController.postInvest);

router.put('/invest', isAuth, investController.putInvest);

router.delete('/invest', isAuth, investController.deleteInvest);

module.exports = router;