const express = require("express");
const ExpressError = require("../helpers/ExpressError");
const { ensureCorrectUser, authRequired } = require("../middleware/auth");
const User = require("../models/User");
const { validate } = require("jsonschema");
const { userNewSchema, userUpdateSchema } = require("../schemas");
const createToken = require("../helpers/createToken");

const router = express.Router();


// get user 

// add user 

// update user

// delete user 


module.exports = router;
