// authentication middleware

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");


// Authenticate user

function authenticateJWT(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;
    const payload = jwt.verify(tokenStr, SECRET_KEY);
    req.user = payload;
    res.locals.username = token.username;
    return next();
  } catch (err) {
    return next(new ExpressError("Unathorized", 401));
  }
}

// Requires user is admin

function ensureAdmin(req, res, next) {
  try {
    const tokenStr = req.body._token;

    let token = jwt.verify(tokenStr, SECRET_KEY);
    res.locals.username = token.username;

    if (token.is_admin) {
      return next();
    }
    throw new Error();
  } catch (err) {
    return next(new ExpressError("You must be an admin to access", 401));
  }
}

// Requires correct username

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

module.exports = {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUser,
};