const express = require('express');

const homeController = require('../controllers/home.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', isAuth, homeController.getDashboard);

module.exports = router;