const express = require("express");
const ExpressError = require("./expressError")
const Company = require('./models.companies')

const router = new express.Router();

router.get("/", async function(req, res, next) {
  try {
    let result = await Company.getAll();
    return res.json({ result });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
