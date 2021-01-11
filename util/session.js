const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);

const { DB_USER, DB_PASSWORD, DB_HOST, DB_SCHEMA, DB_PORT } = process.env;
let optionsStore = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
  expiration: 14400000,
};
let sessionStore = new MySQLStore(optionsStore);
let sessionUtil = session({
  secret: process.env.SESSION_SECRET_KEY,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   //expires: 1000
  // }
});

module.exports = sessionUtil;
