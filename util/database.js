const Sequelize = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_SCHEMA } = process.env;

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  dialectOptions: { decimalNumbers: true }
});

module.exports = sequelize;