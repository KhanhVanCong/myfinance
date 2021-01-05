const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DeptModel = sequelize.define('dept', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  creditor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  money: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false
  },
  dateOfBorrow: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  lendingRate: {
    type: Sequelize.STRING
  },
  dueDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }

});

module.exports = DeptModel;
