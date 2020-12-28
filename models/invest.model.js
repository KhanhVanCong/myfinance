const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const InvestModel = sequelize.define('invest', {
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
  investIn: {
    type: Sequelize.STRING,
    allowNull: false
  },
  profit: {
    type: Sequelize.STRING,
  },
  dateTerm: {
    type: Sequelize.DATEONLY,
  },
});

module.exports = InvestModel;
