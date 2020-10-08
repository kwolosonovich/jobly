const express = require("express");
const ExpressError = require("../helpers/expressError");
const { ensureCorrectUser, authRequired } = require("../middleware/authenticate");
const User = require("../models/user");
// const { validate } = require("jsonschema");
// const { userNewSchema, userUpdateSchema } = require("../schemas");
// const createToken = require("../helpers/createToken");

const router = express.Router();


// GET - all users with filter

router.get("/", async (req, res, next) => {
  try {
    const result = await User.getAll(req.query);
    return res.json({ result });
  } catch (err) {
    return next(err);
  }
});

// GET - search username 

router.get("/:username", async (req, res, next) => {
  const username = req.params.username;
  try {
    const result = await User.getUser(username);
    return res.status(201).json({ user: result });
  } catch (err) {
    return next(err);
  }
});

// POST - add new user 

router.post("/", async(req, res, next) => {
  let user = req.body 
  try {
    const result = await User.add(user)
    return res.json({ user: result})
  } catch (err) {
    return next(err);
  }
})

// PATCH - update user

router.patch("/:username", async(req, res, next) => {
  let username = req.params.username
  let data = req.body 
  try {
    const result = await User.update(username, data);
    return res.json({ updated: result });
  } catch (err) {
    return next(err);
  }
})


// DELETE - delete user 

router.delete("/:username", async(req, res, next) => {
  let username = req.params.username
  try {
    const result = await User.delete(username)
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return next(err)
  }
})


module.exports = router;
