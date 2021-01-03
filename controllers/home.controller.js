const Finance = require('../models/financial.model');
const Invest = require('../models/invest.model');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

exports.getDashboard = async (req, res, next) => {
  const userId = req.user.id;
  const [ totalIncome,
          totalIncomeByCash,
          totalExpense,
          totalExpenseByCash,
          totalDept,
          totalInvest,
          totalInvestByCash ] = await Promise.all([
    getTotalIncome(userId),
    getTotalIncomeByCash(userId),
    getTotalExpense(userId),
    getTotalExpenseByCash(userId),
    getTotalDept(userId),
    getTotalInvest(userId),
    getTotalInvestByCash(userId)
  ]);

  const totalMoneyAvailable = totalIncome - totalExpense - totalInvest;
  const totalMoneyAvailableByCash = totalIncomeByCash - totalExpenseByCash - totalInvestByCash;
  const totalMoneyAvailableByBank = totalMoneyAvailable - totalMoneyAvailableByCash;

  // Data chart for Income
  // const incomesInYear = await Finance.findAll({
  //   attributes: [
  //     [sequelize.fn('sum', sequelize.col('money')), 'totalMoney'],
  //   ],
  //   where: {
  //     categoryFinancialId: 1
  //   },
  //   group: [sequelize.fn('date_trunc', 'year', sequelize.col('date'))]
  // });

  res.render('home/dashboard', {
    path: '/dashboard',
    pageTitle: "Dashboard",
    totalIncome,
    totalExpense,
    totalDept,
    totalInvest,
    totalMoneyAvailable,
    totalMoneyAvailableByCash,
    totalMoneyAvailableByBank
  });
};

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

function getTotalDept(userId) {
  return Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 3
    }
  })
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

function getIncomesInYear(userId) {
  return req.user.getFinancials({
    where: {
      categoryFinancialId: 1
    }
  })
}
