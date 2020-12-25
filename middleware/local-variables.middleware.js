module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.session.user ? true : false;
  res.locals.userName = req.session.user ?  req.session.user.name : '';
  res.locals.csrfToken = req.csrfToken();
  next();
}