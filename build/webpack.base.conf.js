const resolve = require('path').resolve


module.exports = {
  externalsPresets: { node: true },
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: [ './app.js' ],
  output: {
    filename: "app.bundle.js",
    path: resolve(__dirname, './../dist')
  }
}
