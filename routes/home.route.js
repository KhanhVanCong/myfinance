const express = require('express');

const homeController = require('../controllers/home.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', isAuth, homeController.getDashboard);

router.get('/getincomesinyear/:year', isAuth, homeController.getIncomesInYear);

router.get('/getexpensesinyear/:year', isAuth, homeController.getExpensesInYear);

router.get('/getinvestsinyear/:year', isAuth, homeController.getInvestsInYear);

router.get('/getdeptsinyear/:year', isAuth, homeController.getDeptsInYear);

module.exports = router;