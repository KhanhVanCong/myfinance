const Finance = require('../models/financial.model');
const Invest = require('../models/invest.model');
const Dept = require('../models/dept.model');
const DeptPayment = require('../models/dept-payment-history.model');
const sequelize = require('sequelize');
const { Op } = require("sequelize");

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [ totalIncome,
            totalIncomeByCash,
            totalExpense,
            totalExpenseByCash,
            totalDept,
            totalInvest,
            totalInvestByCash,
            totalMoneyTransferBankToCash] = await Promise.all([
      getTotalIncome(userId),
      getTotalIncomeByCash(userId),
      getTotalExpense(userId),
      getTotalExpenseByCash(userId),
      getTotalDept(userId),
      getTotalInvest(userId),
      getTotalInvestByCash(userId),
      getTotalMoneyTransferBankToCash(userId)
    ]);

    const totalMoneyAvailable = totalIncome - totalExpense - totalInvest - totalMoneyTransferBankToCash;
    const totalMoneyAvailableByCash = totalIncomeByCash - totalExpenseByCash - totalInvestByCash;
    const totalMoneyAvailableByBank = totalMoneyAvailable - totalMoneyAvailableByCash;

    res.render('home/dashboard', {
      path: '/dashboard',
      pageTitle: "Dashboard",
      totalIncome,
      totalExpense,
      totalDept,
      totalInvest,
      totalMoneyAvailable,
      totalMoneyAvailableByCash,
      totalMoneyAvailableByBank,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getIncomesInYear = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = req.params.year;
    const incomesInYear = await Finance.findAll({
      attributes: [
        [ sequelize.fn('month', sequelize.col('date')), 'month' ],
        [ sequelize.fn('sum', sequelize.col('money')), 'totalMoney' ],
      ],
      where: {
        $and: sequelize.where(sequelize.fn("year", sequelize.col("date")), year),
        categoryFinancialId: 1,
        userId
      },
      group: 'month'
    });
    res.status(200)
       .json({
         data: incomesInYear,
         message: 'Get total incomes success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get total incomes failed!'
       });
  }
}

exports.getExpensesInYear = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = req.params.year;
    const expensesInYear = await Finance.findAll({
      attributes: [
        [ sequelize.fn('month', sequelize.col('date')), 'month' ],
        [ sequelize.fn('sum', sequelize.col('money')), 'totalMoney' ],
      ],
      where: {
        $and: sequelize.where(sequelize.fn("year", sequelize.col("date")), year),
        categoryFinancialId: 2,
        userId
      },
      group: 'month'
    });
    res.status(200)
       .json({
         data: expensesInYear,
         message: 'Get total expenses success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get total expenses failed!'
       });
  }
}

exports.getInvestsInYear = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = req.params.year;
    const investInYear = await Invest.findAll({
      attributes: [
        [ sequelize.fn('month', sequelize.col('date')), 'month' ],
        [ sequelize.fn('sum', sequelize.col('money')), 'totalMoney' ],
      ],
      where: {
        $and: sequelize.where(sequelize.fn("year", sequelize.col("date")), year),
        userId
      },
      group: 'month'
    });
    res.status(200)
       .json({
         data: investInYear,
         message: 'Get total invests success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get total invests failed!'
       });
  }
}

exports.getDeptsInYear = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = req.params.year;
    const deptsInYear = await Dept.findAll({
      attributes: [
        [ sequelize.fn('month', sequelize.col('dateOfBorrow')), 'month' ],
        [ sequelize.fn('sum', sequelize.col('money')), 'totalMoney' ],
      ],
      where: {
        $and: sequelize.where(sequelize.fn("year", sequelize.col("dateOfBorrow")), year),
        userId
      },
      group: 'month'
    });
    res.status(200)
       .json({
         data: deptsInYear,
         message: 'Get total depts success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get total depts failed!'
       });
  }
}

function getTotalIncome(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 1
    }
  })
}

function getTotalIncomeByCash(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 1,
      paymentMethodId: 1
    }
  })
}

function getTotalExpense(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 2
    }
  })
}

function getTotalExpenseByCash(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 2,
      paymentMethodId: 1
    }
  })
}

async function getTotalDept(userId) {
   const [ totalMoneyDept, totalPayment ] = await Promise.all([
     Dept.sum('money', {
       where: {
         userId
       }
     }),
    DeptPayment.sum('money', {
       where: {
         userId
       }
     })
   ]);
   return totalMoneyDept - totalPayment;
}

function getTotalInvest(userId) {
  return Invest.sum('money', { where: { userId } })
}

function getTotalInvestByCash(userId) {
  return Invest.sum('money', {
    where:
      {
        userId,
        paymentMethodId: 1
      }
  })
}

function getTotalMoneyTransferBankToCash(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 4,
      [Op.not]: [
        { paymentMethodId: 1 },
      ]
    }
  });
}
