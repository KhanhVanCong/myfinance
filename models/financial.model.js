const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FinancialModel = sequelize.define('financial', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  money: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  source: {
    type: Sequelize.STRING
  }

});

module.exports = FinancialModel;
