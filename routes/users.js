const express = require("express");
const ExpressError = require("../helpers/expressError");
const { ensureCorrectUser, authRequired } = require("../middleware/authenticate");
const User = require("../models/user");
// const { validate } = require("jsonschema");
// const { userNewSchema, userUpdateSchema } = require("../schemas");
// const createToken = require("../helpers/createToken");

const router = express.Router();


// get user 

// add user 

// update user

// delete user 


module.exports = router;
