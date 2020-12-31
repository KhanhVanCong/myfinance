const { validationResult } = require('express-validator/check');

const CategoryInvest = require('../models/category-invest.model');
const CategoryTerm = require('../models/category-term.model');
const Invest = require('../models/invest.model');

exports.getListInvest = async (req, res, next) => {
  try {
    const lstInvest = await req.user.getInvests({
      include: [ 'category_invest', 'payment_method', 'category_term' ],
    });
    res.render('invest/list', {
      path: '/invest',
      pageTitle: "Invest",
      lstInvest
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getInvest = async (req, res, next) => {
  try {
    const investID = req.params.id;
    const invest = await Invest.findByPk(investID, {
      where: { userId: req.user.id },
      include: [ 'category_invest', 'payment_method', 'category_term' ],
    });
    if (invest) {
      res.status(200)
         .json({
           data: invest,
           message: 'Get invest success!'
         });
    } else {
      res.status(404)
         .json({
           message: 'Not found invest!'
         });
    }
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get invest failed.'
       });
  }
};

exports.postInvest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const {
            desc,
            investIn,
            money,
            profit,
            date,
            categoryInvestId,
            paymentMethodId,
            categoryTermId,
            dateTerm
          } = req.body;
    const invest = await req.user.createInvest({
      desc, investIn, money, profit, date, categoryInvestId, paymentMethodId, categoryTermId, dateTerm
    });
    const getFullResult = await invest.reload({
      include: [ 'category_invest', 'payment_method', 'category_term' ],
    });
    const descCategoryInvest = getFullResult.category_invest.desc;
    const descCategoryTerm = getFullResult.category_term.desc;
    const descPaymentMethod = getFullResult.payment_method.desc;
    const dateResult = getFullResult.date;
    const dateTermResult = getFullResult.dateTerm;
    let { id, updatedAt } = getFullResult;
    updatedAt = updatedAt.toLocaleString('en-Us');
    const result = {
      id,
      desc,
      money,
      profit,
      dateResult,
      investIn,
      descCategoryInvest,
      descCategoryTerm,
      dateTermResult,
      descPaymentMethod,
      updatedAt
    };
    res.status(200)
       .json({
         data: result,
         message: 'Create financial success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Create financial failed.'
       });
  }
};

exports.putInvest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { id, desc, investIn, money, profit, date, categoryInvestId, paymentMethodId, categoryTermId, dateTerm } = req.body;
    const invest = await Invest.findByPk(id, {
      where: { userId: req.user.id }
    });
    if (invest) {
      invest.desc = desc;
      invest.investIn = investIn;
      invest.money = money;
      invest.profit = profit;
      invest.date = date;
      invest.categoryInvestId = categoryInvestId;
      invest.paymentMethodId = paymentMethodId;
      invest.categoryTermId = categoryTermId;
      invest.dateTerm = dateTerm;
      await invest.save();
      res.status(200)
         .json({
           message: 'Update financial success!'
         });
    } else {
      res.status(404)
         .json({
           message: 'Not found invest!'
         });
    }
  } catch (err) {
    res.status(500)
       .json({
         message: 'Update financial failed.'
       });
  }
};

exports.deleteInvest = async (req, res, next) => {
  try {
    const { id } = req.body;
    const invest = await Invest.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    const result = await invest.destroy();
    if (result) {
      res.status(200)
         .json({
           message: 'Delete invest success!'
         });
    } else {
      res.status(404)
         .json({
           message: 'Not found invest!'
         });
    }
  } catch (err) {
    res.status(500)
       .json({
         message: 'Deleting invest failed.'
       });
  }
};

exports.getListCategoryInvest = async (req, res, next) => {
  try {
    const categories = await CategoryInvest.findAll();
    res.status(200)
       .json({
         data: categories,
         message: 'Get list categories success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get list categories failed.'
       });
  }
};

exports.getListCategoryTerm = async (req, res, next) => {
  try {
    const categories = await CategoryTerm.findAll();
    res.status(200)
       .json({
         data: categories,
         message: 'Get list categories success!'
       });
  } catch (err) {
    res.status(500)
       .json({
         message: 'Get list categories failed.'
       });
  }
};
