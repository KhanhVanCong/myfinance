const Finance = require('../models/financial.model');
const Invest = require('../models/invest.model');

exports.getDashboard = async (req, res, next) => {
  const userId = req.user.id;
  const totalIncome = await Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 1
    }
  });
  const totalIncomeByCash = await Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 1,
      paymentMethodId: 1
    }
  });
  const totalExpense = await Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 2
    }
  });
  const totalExpenseByCash = await Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 2,
      paymentMethodId: 1
    }
  });
  const totalDept = await Finance.sum('money', {
    where: {
      userId,
      categoryFinancialId: 3
    }
  });
  const totalInvest = await Invest.sum('money', { where: { userId } });
  const totalInvestByCash = await Invest.sum('money', {
    where:
      {
        userId,
        paymentMethodId: 1
      }
  });
  const totalMoneyAvailable = totalIncome - totalExpense - totalInvest;
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
    totalMoneyAvailableByBank
  });
};
