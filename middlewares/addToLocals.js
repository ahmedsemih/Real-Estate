const moment=require("moment");

module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.signedCookies.currentUser ? true : false;
  res.locals.currentUser = req.signedCookies.currentUser;
  res.locals.role = req.signedCookies.role;
  res.locals.moment = moment;
  next();
};
