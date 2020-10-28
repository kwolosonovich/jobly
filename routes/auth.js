const express = require("express");
const User = require("../models/user");
const create = require("../helpers/token");
const ExpressError = require("../helpers/expressError");

const router = new express.Router();

// login returning user/admin
// validate username and password

router.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      throw new ExpressError("Username and password required", 401);
    }
    const user = await User.validatePassword(username, password); // validate password
    const token = create(user); // create JWT
    User.updateLoginTimestamp(username); // update db login timestamp
    return res.json({
      token
    });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;