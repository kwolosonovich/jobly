const express = require("express");
const ExpressError = require("../helpers/expressError")
const Company = require('../models/company')

const router = new express.Router();

router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});


router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.findOne(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
