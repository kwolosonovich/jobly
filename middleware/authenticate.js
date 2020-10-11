// authentication middleware

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");


// Authenticate user by verifying JWT

function authenticateJWT(req, res, next) {
      let inputToken = req.body.token || req.query.token;
      console.log(inputToken);
  try {
    // const inputToken = req.body.token || req.query.token;
    console.log(inputToken)
    const payload = jwt.verify(inputToken, SECRET_KEY);
    req.user = payload;
    res.locals.username = token.username;
    return next();
  } catch (err) {
    return next(new ExpressError("Unathorized", 401));
  }
}

// Verify if admin by validating token is_admin status

function ensureAdmin(req, res, next) {
  try {
    const inputToken = req.body.token;

    let token = jwt.verify(inputToken, SECRET_KEY);
    res.locals.username = token.username;

    if (token.is_admin) {
      return next();
    }
    throw new Error();
  } catch (err) {
    return next(new ExpressError("You must be an admin to access", 401));
  }
}

// Verify correct user by validating token username 

function ensureCorrectUser(req, res, next) {
  console.log(req.body)
  console.log(token.username)
  try {
    const inputToken = req.body.token;

    let token = jwt.verify(inputToken, SECRET_KEY);

    res.locals.username = token.username;

    if (token.username === req.params.username) {
      return next();
    }
    throw new Error();
  } catch (err) {
    return next(new ExpressError("Unauthorized", 401));
  }
}

module.exports = {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUser,
};