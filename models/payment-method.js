const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PaymentMethod = sequelize.define('payment_method', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = PaymentMethod;
