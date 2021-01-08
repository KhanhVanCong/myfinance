const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DeptPaymentHistoryModel = sequelize.define('dept_payment_history', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  note: {
    type: Sequelize.STRING,
    allowNull: true
  },
  money: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});

module.exports = DeptPaymentHistoryModel;
