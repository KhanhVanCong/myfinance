const User = require('../models/user.model');

module.exports = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return next();
  }
  User.findByPk(user.id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}