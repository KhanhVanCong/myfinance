require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error.controller');
const sequelize = require('./util/database');

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", "views");

// Secure header
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Compression file
app.use(compression());

// Log system
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'))
app.use(morgan('combined', { stream: accessLogStream }));

// Handle Body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// config public folder
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, "public")));

// session config in database
const sessionConfig = require('./util/session');
app.use(sessionConfig);

// CSRF
const csrfProtection = csrf();
app.use(csrfProtection);

// Locals variable
const localVariableMiddleWare = require('./middleware/local-variables.middleware');
app.use(localVariableMiddleWare);

// Session
const sessionMiddleWare = require('./middleware/session.middleware');
app.use(sessionMiddleWare);

// Route
const authRoutes = require("./routes/auth.route");
const homeRoutes = require("./routes/home.route");
const financialRoutes = require("./routes/finance.route");
const investRoutes = require("./routes/invest.route");
app.use(authRoutes);
app.use(homeRoutes);
app.use(financialRoutes);
app.use(investRoutes);

// Handle Errors
app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.status(error.httpStatusCode)
     .render("500", {
       path: "/500",
       pageTitle: "Error!",
       error
     });
});

// Relational Database
require('./util/relation-db');

// Database
app.listen(process.env.PORT);
// sequelize
//   // .sync({force: true})
//   .sync({alter: true})
//   //.sync()
//   .then(result => {
//     app.listen(process.env.PORT);
//   })
//   .catch(err => console.log(err));

