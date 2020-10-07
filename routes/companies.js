const express = require("express");
const ExpressError = require("../helpers/expressError")
const Company = require('../models/company')

const router = new express.Router();


// GET - all companies with filter

router.get("/", async (req, res, next) => {
  try {
    const companies = await Company.getAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

// GET - search handle name

router.get("/:handle", async (req, res, next) => {
  const handle = req.params.handle
  try {
    const company = await Company.handleName(handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// POST - add new company 

router.post("/", async(req, res, next) => {
  let data = req.body // company object 
  try {
    const newCompany = await Company.add(data)
    return res.json({company: newCompany})
  } catch (err) {
    return next(err);
  }
})

// PATCH - update company

router.patch("/:handle", async(req, res, next) => {
  let handle = req.params.handle
  let data = req.body 
  try {
    const updateCompany = await Company.update(handle, data);
    return res.json({ updated: updateCompany });
  } catch (err) {
    return next(err);
  }
})


// DELETE - delete company 

router.delete("/:handle", async(req, res, next) => {
  let handle = req.params.handle
  try {
    const deleteCompany = await Company.delete(handle)
    return res.json({ message: 'Company deleted' });
  } catch (err) {
    return next(err)
  }
})

module.exports = router;
