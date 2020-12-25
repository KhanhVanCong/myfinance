const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CategoryInvestModel = sequelize.define('category_invest', {
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

module.exports = CategoryInvestModel;
