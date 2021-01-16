const base = require('./webpack.base.conf');
const webpack = require('webpack');
const resolve = require('path').resolve;
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




base.mode = 'production';
base.externals = [nodeExternals({
  // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
  // allowlist: [/^bcryptjs/, /^body-parser/, /^compression/, /^connect-flash/, /^csurf/, /^dotenv/, /^ejs/, /^express/,
  // /^express-session/, /^express-validator/, /^helmet/, /^morgan/, /^nodemailer/, /^nodemailer-sendgrid-transport/]
  // /compression/
  // /csurf/
  // /ejs/
  // /express/
  // /express-mysql-session/
  // /express-validator/
  // /morgan/
  // mysql2
  // /nodemailer-sendgrid-transport/
  // /sequelize/

  allowlist: [/bcryptjs/, /body-parser/, /connect-flash/, /dotenv/, /express-session/, /helmet/, /nodemailer/]
})];
base.plugins = [
  new CleanWebpackPlugin(),
  new webpack.ContextReplacementPlugin(
    /express\/lib/,
    resolve(__dirname, '../node_modules'),
    {
      'ejs': 'ejs'
    }
  )
]

base.stats = {
  warningsFilter: /require\.extensions/
}

module.exports = base;
