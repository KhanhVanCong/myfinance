const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CategoryTermModel = sequelize.define('category_term', {
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

module.exports = CategoryTermModel;
