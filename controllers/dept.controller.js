const { validationResult } = require('express-validator/check');

const Dept = require('../models/dept.model');
const DeptPaymentHistory = require('../models/dept-payment-history.model');

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

exports.getDept = async (req, res, next) => {
  try {
    const deptId = req.params.id;
    const dept = await Dept.findByPk(deptId, {
      where: { userId: req.user.id },
      include: [ 'payment_method' ],
    });
    if (dept) {
      res.status(200).json({
        data: dept,
        message: 'Get dept success!'
      });
    } else {
      res.status(404).json({
        message: 'Not found dept!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Get dept failed.'
    });
  }
};

exports.getDeptDetail = async (req, res, next) => {
  try {
    const deptId = req.params.id;
    const userId = req.user.id;
    const [ dept, deptsPaymentHistory, totalMoneyPaid ] = await Promise.all([
      findDept(deptId, userId),
      findDeptsPaymentHistory(deptId),
      getTotalMoneyPaid(deptId)
    ])
    res.render('dept/detail', {
      path: '/dept',
      pageTitle: "Dept",
      dept,
      deptsPaymentHistory,
      totalMoneyPaid
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDept = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { creditor, desc, money, dateOfBorrow, lendingRate, dueDate, paymentMethodId } = req.body;
    const dept = await req.user.createDept({
      creditor, desc, money, dateOfBorrow, lendingRate, dueDate, paymentMethodId, isDone: false
    });
    const getFullResult = await dept.reload({
      include: [ 'payment_method' ]
    });
    const descPaymentMethod = getFullResult.payment_method.desc;
    const dateOfBorrowResult = getFullResult.dateOfBorrow;
    const dueDateResult = getFullResult.dueDate;
    let { id, updatedAt } = getFullResult;
    updatedAt = updatedAt.toLocaleString('en-Us');
    const result = { id, desc, money, lendingRate, creditor, dateOfBorrowResult, dueDateResult, isDone: false, descPaymentMethod, updatedAt };
    res.status(200)
       .json({
         data: result,
         message: 'Create dept success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Create dept failed.'
       });
  }
};

exports.putDept = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { id, creditor, desc, money, dateOfBorrow, lendingRate, dueDate, paymentMethodId } = req.body;
    const dept = await Dept.findByPk(id, {
      where: { userId: req.user.id }
    });
    dept.desc = desc;
    dept.money = money;
    dept.creditor = creditor;
    dept.dateOfBorrow = dateOfBorrow;
    dept.lendingRate = lendingRate;
    dept.dueDate = dueDate;
    dept.paymentMethodId = paymentMethodId;
    await dept.save();
    res.status(200)
       .json({
         message: 'Update dept success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Update dept failed.'
       });
  }
};

exports.deleteDept = async (req, res, next) => {
  try {
    const { id } = req.body;
    const dept = await Dept.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    const result = await dept.destroy();
    if (result) {
      res.status(200).json({
        message: 'Delete dept success!'
      });
    } else {
      res.status(404).json({
        message: 'Not found dept!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Deleting dept failed.'
    });
  }
};

function findDept(deptId, userId) {
  return Dept.findByPk(deptId, {
    where: {
      userId
    },
    include: [ 'payment_method' ],
  })
}

function findDeptsPaymentHistory(deptId) {
  return DeptPaymentHistory.findAll({
    where: {
      deptId
    },
    include: [ 'payment_method' ],
  });
}

function getTotalMoneyPaid(deptId) {
  return DeptPaymentHistory.sum('money', {
    where: {
      deptId
    }
  });
}