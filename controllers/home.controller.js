exports.getDashboard = (req, res, next) => {
  res.render('home/dashboard', {
    path: '/dashboard',
    pageTitle: "Dashboard",
  });
};
