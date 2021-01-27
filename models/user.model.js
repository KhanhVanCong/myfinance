const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserModel = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
  },
  resetToken: {
    type: Sequelize.STRING,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
  },
  googleId: {
    type: Sequelize.STRING,
  }
});

module.exports = UserModel;
