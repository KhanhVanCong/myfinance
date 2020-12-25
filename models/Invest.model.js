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
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  profit: {
    type: Sequelize.STRING,
  },
  term: {
    type: Sequelize.DATEONLY,
  },
});

module.exports = InvestModel;
