const User = require('../models/user.model');
const Financial = require('../models/financial.model');
const CategoryFinancial = require('../models/category-financial.model');
const PaymentMethod = require('../models/payment-method.model');
const Invest = require('../models/invest.model');
const CategoryInvest = require('../models/category-invest.model');
const CategoryTerm = require('../models/category-term.model');
const Dept = require('../models/dept.model');
const DeptPaymentHistory = require('../models/dept-payment-history.model');

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
Invest.belongsTo(CategoryTerm);
CategoryTerm.hasMany(Invest);
Invest.belongsTo(PaymentMethod);
PaymentMethod.hasMany(Invest);

Dept.belongsTo(User);
User.hasMany(Dept);
Dept.belongsTo(PaymentMethod);
PaymentMethod.hasMany(Dept);

DeptPaymentHistory.belongsTo(User);
User.hasMany(DeptPaymentHistory);
DeptPaymentHistory.belongsTo(Dept);
Dept.hasMany(DeptPaymentHistory, { onDelete: 'cascade', hooks: true });
DeptPaymentHistory.belongsTo(PaymentMethod);
PaymentMethod.hasMany(DeptPaymentHistory);
