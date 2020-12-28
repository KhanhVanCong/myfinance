const { validationResult } = require('express-validator/check');

const Category = require('../models/category-financial.model');
const PaymentMethod = require('../models/payment-method.model');
const Financial = require('../models/financial.model');

exports.getListFinancial = async (req, res, next) => {
  try {
    const lstFinancial = await Financial.findAll({
      include: [ 'category_financial', 'payment_method'  ],
    });
    res.render('financial/list', {
      path: '/financial',
      pageTitle: "Financial",
      lstFinancial
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getFinancial = async (req, res, next) => {
  try {
    const financialId = req.params.id;
    const financial = await Financial.findByPk(financialId, {
      include: [ 'category_financial', 'payment_method'  ],
    });
    if(financial) {
      res.status(200).json({
        data: financial,
        message: 'Get financial success!'
      });
    } else {
      res.status(404).json({
        message: 'Not found financial!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Get financial failed.'
    });
  }
};

exports.postFinancial = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { desc, money, source, date, categoryFinancialId, paymentMethodId } = req.body;
    const financial = await req.user.createFinancial({
      desc,
      money,
      source,
      date,
      categoryFinancialId,
      paymentMethodId
    });
    const getFullResult = await financial.reload({
      include: [ 'category_financial', 'payment_method'  ]
    });
    const descCategory = getFullResult.category_financial.desc;
    const descPaymentMethod = getFullResult.payment_method.desc;
    const dateResult = getFullResult.date;
    let { id, updatedAt } = getFullResult;
    updatedAt = updatedAt.toLocaleString('en-Us');
    const result = { id, desc, money, dateResult, source, descCategory, descPaymentMethod, updatedAt };
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

exports.putFinancial = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { id, desc, money, source, date, categoryFinancialId, paymentMethodId } = req.body;
    const financial = await Financial.findByPk(id);
    financial.desc = desc;
    financial.money = money;
    financial.source = source;
    financial.date = date;
    financial.categoryFinancialId = categoryFinancialId;
    financial.paymentMethodId = paymentMethodId;
    await financial.save();
    res.status(200)
      .json({
        message: 'Update financial success!'
      });
  } catch (err) {
    res.status(500)
      .json({
        message: 'Update financial failed.'
      });
  }
};

exports.deleteFinancial = async (req, res, next) => {
  try {
    const { id } = req.body;
    const financial = await Financial.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });
    const result = await financial.destroy();
    if(result) {
      res.status(200).json({
        message: 'Delete financial success!'
      });
    }else {
      res.status(404).json({
        message: 'Not found financial!'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Deleting financial failed.'
    });
  }
};

exports.getListCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
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

exports.getListPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findAll();
    res.status(200)
      .json({
        data: paymentMethod,
        message: 'Get list categories success!'
      });
  } catch (err) {
    res.status(500)
      .json({
        message: 'Deleting product failed.'
      });
  }
};
