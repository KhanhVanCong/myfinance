const User = require('../models/user.model');
const Financial = require('../models/financial.model');
const CategoryFinancial = require('../models/category-financial.model');
const PaymentMethod = require('../models/payment-method.model');
const Invest = require('../models/Invest.model');
const CategoryInvest = require('../models/category-invest.model');

Financial.belongsTo(User);
User.hasMany(Financial);
Financial.belongsTo(CategoryFinancial);
CategoryFinancial.hasMany(Financial);
Financial.belongsTo(PaymentMethod);
PaymentMethod.hasMany(Financial);
Invest.belongsTo(User);
User.hasMany(Invest);
Invest.belongsTo(CategoryInvest);
CategoryInvest.hasMany(Invest);
Invest.belongsTo(PaymentMethod);
PaymentMethod.hasMany(Invest);