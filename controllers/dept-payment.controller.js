const { validationResult } = require('express-validator/check');
const { Op } = require('sequelize');

const DeptPaymentHistory = require('../models/dept-payment-history.model');
const Dept = require('../models/dept.model');

exports.getDeptPayment = async (req, res, next) => {
  try {
    const deptPaymentId = req.params.id;
    const deptPayment = await DeptPaymentHistory.findByPk(deptPaymentId, {
      where: { userId: req.user.id },
      include: [ 'payment_method' ],
    });
    if (deptPayment) {
      res.status(200).json({
        data: deptPayment,
        message: 'Get dept payment history success!'
      });
    } else {
      res.status(404).json({
        message: 'Not found dept payment history!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Get dept payment history failed.'
    });
  }
};

exports.postDeptPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { deptId, note, money, date, paymentMethodId } = req.body;
    const userId = req.user.id;
    const dept = await findDeptById(deptId, userId);
    if (dept) {
      const totalDeptPaid = await getTotalDeptPaid(deptId);
      if ((totalDeptPaid + parseInt(money)) <= dept.money) {
        const deptPayment = await dept.createDept_payment_history({
          userId, note, money, date, paymentMethodId
        });
        const getFullResult = await deptPayment.reload({
          include: [ 'payment_method' ]
        });
        const descPaymentMethod = getFullResult.payment_method.desc;
        const dateResult = getFullResult.date;
        let { id, updatedAt } = getFullResult;
        updatedAt = updatedAt.toLocaleString('en-Us');

        // Calc status for dept
        if (dept.money === (totalDeptPaid + getFullResult.money)) {
          dept.isDone = true;
        } else {
          dept.isDone = false
        }
        await dept.save();

        // Return result
        const result = { id, note, money, dateResult, descPaymentMethod, updatedAt };
        res.status(200)
           .json({
             data: result,
             message: 'Create dept payment success!'
           });
      } else {
        throw new Error('Over money payment')
      }

    } else {
      res.status(404).json({
        message: 'Not found dept!'
      });
    }
  } catch (err) {
    res.status(500)
       .json({
         message: `Create dept payment failed. Message ${ err }`
       });
  }
};

exports.putDeptPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { deptId, paymentId, note, money, date, paymentMethodId } = req.body;
    const userId = req.user.id;
    const [ dept, deptPayment ] = await Promise.all([ findDeptById(deptId, userId),
      findDeptPaymentHistoryById(paymentId, userId) ]);
    if (dept && deptPayment) {
      const totalDeptPaid = await getTotalDeptPaidWithoutPaymentId(deptId, paymentId);
      if ((totalDeptPaid + parseInt(money)) <= dept.money) {
        deptPayment.note = note;
        deptPayment.money = money;
        deptPayment.date = date;
        deptPayment.paymentMethodId = paymentMethodId;
        await deptPayment.save();

        // Calc status for dept
        const totalMoneyPaid = await getTotalDeptPaid(deptId);
        if (dept.money === totalMoneyPaid) {
          dept.isDone = true;
        } else {
          dept.isDone = false
        }
        await dept.save();

        res.status(200)
           .json({
             message: 'Update dept payment success!'
           });
      } else {
        throw new Error('Over money payment');
      }
    } else {
      res.status(404).json({
        message: 'Not found!'
      });
    }


  } catch (err) {
    res.status(500)
       .json({
         message: `Update dept payment failed.Message ${ err }`
       });
  }
};

exports.deleteDeptPayment = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    const deptPayment = await DeptPaymentHistory.findOne({
      where: {
        id,
        userId
      }
    });
    const deptId = deptPayment.deptId;
    const result = await deptPayment.destroy();
    if (result) {
      // Calc status for dept
      const [ totalMoneyPaid, dept ] = await Promise.all([
        getTotalDeptPaid(deptId),
        findDeptById(deptId, userId)
      ]);

      if (dept.money === totalMoneyPaid) {
        dept.isDone = true;
      } else {
        dept.isDone = false
      }
      await dept.save();

      res.status(200).json({
        message: 'Delete dept payment history success!'
      });
    } else {
      res.status(404).json({
        message: 'Not found dept payment history!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Deleting dept payment history failed.'
    });
  }
};

function findDeptById(id, userId) {
  return Dept.findByPk(id, {
    where: {
      userId
    }
  });
}

function findDeptPaymentHistoryById(paymentId, userId) {
  return DeptPaymentHistory.findByPk(paymentId, {
    where: { userId }
  });
}

function getTotalDeptPaid(deptId, paymentId) {
  return DeptPaymentHistory.sum('money', {
    where: {
      deptId
    }
  });
}

function getTotalDeptPaidWithoutPaymentId(deptId, paymentId) {
  return DeptPaymentHistory.sum('money', {
    where: {
      deptId,
      [Op.not]: [
        {
          id: paymentId
        }
      ]
    }
  });
}

