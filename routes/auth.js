const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const getToken = require("../helpers/token")
const ExpressError = require("../helpers/expressError");

const router = new express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      throw new ExpressError("Username and password required", 401);
    }
    const user = await User.authenticate(username, password);
    const token = getToken(user); // create JWT
    User.updateLoginTimestamp(username); // update db login timestamp
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
    const token = await getToken(registerUser)  // get new JWT 
    User.updateLoginTimestamp(registerUser.username); // update db login timestamp
    console.log(token)
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
