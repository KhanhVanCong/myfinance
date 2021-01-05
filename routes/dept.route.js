const express = require('express');
const { body } = require('express-validator/check');

const deptController = require('../controllers/dept.controller');
const isAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dept', isAuth, deptController.getListDepts);

module.exports = router;