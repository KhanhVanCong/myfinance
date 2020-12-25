const User = require('../models/user');
const Financial = require('../models/financial');
const CategoryFinancial = require('../models/category-financial');
const PaymentMethod = require('../models/payment-method');
const Invest = require('../models/Invest');
const CategoryInvest = require('../models/category-invest');

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