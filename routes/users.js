const express = require("express");
const ExpressError = require("../helpers/expressError");
const User = require("../models/user");
const {
    authenticateJWT,
    ensureAdmin,
    ensureCorrectUser,
} = require("../middleware/authenticate");
const jsonSchema = require("jsonschema")
const userSchema = require("../schemas/userSchema")
const updateUserSchema = require("../schemas/updateUserSchema")
const getToken = require("../helpers/token");

const router = express.Router();


// GET - all users

router.get("/", async (req, res, next) => {
    try {
        const result = await User.getAll(req.query); // query all users from users table 
        return res.json({ users: result }); // return array of user objects
    } catch (err) {
        return next(err);
    }
});

// GET - search for user by username 

router.get("/:username", async (req, res, next) => {
    const username = req.params.username;
    try {
        const result = await User.getUser(username);  // query users table for username
        return res.status(201).json({ user: result }); // return user object
    } catch (err) {
        return next(err);
    }
});

// POST - register a new user

router.post("/", async (req, res, next) => {
  let user = req.body;
  // console.log(user)
  let input = jsonSchema.validate(user, userSchema); // validate inputs with schema

  if (!input.valid) {
    // if invalid/incomplete input data - throw error
    let error = new ExpressError("Invalid user fields", 401);
    return next(error);
  }

  try {
    let newUser = await User.register(user); // register user; add to db
    const token = await getToken(newUser); // get new JWT
    User.updateLoginTimestamp(newUser.username); // update db login timestamp
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})


// PATCH - update user; authenticate JWT to ensure correct user

router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  let username = req.params.username;

  let update = {
     first_name: req.body.first_name, 
     last_name: req.body.last_name, 
     email: req.body.email,
     photo_url: req.body.photo_url
   }

  let password = req.body.password;

  let validateInputs = jsonSchema.validate(update, updateUserSchema); // validate inputs with schema
  // if invalid/incomplete input data - throw error
  if (!validateInputs.valid) {
    let error = new ExpressError("Invalid user fields", 401);
    return next(error);
  }
  try {
    const validatePassword = await User.validatePassword(username, password); // hash and validate password
    const result = await User.update(username, update); //update user in db
    return res.json({ updated: result }); // return user object
  } catch (err) {
    return next(err);
  }
})

// DELETE - delete user; authenticate JWT and password to ensure correct user 

router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
    let username = req.params.username
    let password = req.body.password
    try {
        let verifyUser = await User.validatePassword(username, password); // verify username and password
        let result = await User.delete(username)  // delete user from db 
        return res.json({ message: 'User deleted' });  // return msg if successful
    } catch (err) {
        return next(err)
    }
})


module.exports = router;
