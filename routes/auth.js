const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const JWT_OPTIONS = { expiresIn: 60 * 60 }; 
const ExpressError = require("../helpers/expressError");

const router = new express.Router();
// const createToken = require("../helpers/createToken");

router.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      throw new ExpressError("Username and password required", 401);
    }
    const user = await User.authenticate(username, password);
    const token = createToken(user);
        User.updateLoginTimestamp(username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 401);
    }

    const registerUser = await User.register(req.body); // register user
    const token = jwt.sign({username}, SECRET_KEY, JWT_OPTIONS) // login user and create token
    User.updateLoginTimestamp(username);
    console.log(token)
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
