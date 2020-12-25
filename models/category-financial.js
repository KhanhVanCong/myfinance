const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CategoryFinancial = sequelize.define('category_financial', {
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

module.exports = CategoryFinancial;
