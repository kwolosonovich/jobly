const express = require("express");
const ExpressError = require("../helpers/expressError")
const Company = require('../models/company')
const {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUser,
} = require("../middleware/authenticate");
const jsonSchema = require("jsonschema");
const companySchema = require("../schemas/companySchema")
const updateCompanySchema = require("../schemas/updateCompanySchema");

const router = new express.Router();


// GET - all companies with filter

router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const companies = await Company.getAll(req.query);  // get all companies from db 
    return res.json({ companies }); // return array of company objects
  } catch (err) {
    return next(err);
  }
});

// GET - search for company by handle name

router.get("/:handle", authenticateJWT, async (req, res, next) => {
  const handle = req.params.handle
  try {
    const company = await Company.handleName(handle);  // query by handle
    return res.status(201).json({ company: company });  // return company object
  } catch (err) {
    return next(err);
  }
});

// POST - add new company 

router.post("/", ensureAdmin, async(req, res, next) => {
 let data = {
    handle: req.body.handle,
    name: req.body.name,
    num_employees: req.body.num_employees,
    description: req.body.description,
    logo_url: req.body.logo
  }

  let input = jsonSchema.validate(data, companySchema); // validate inputs with schema

  if (!input.valid) {
    // if invalid/incomplete input data - throw error
    let error = new ExpressError("Invalid company fields", 401);
    return next(error);
  }

  try {
    const newCompany = await Company.add(data); // add new company to db
    return res.json({ company: newCompany }); // return company object
  } catch (err) {
    return next(err);
  }
})

// PATCH - update company in db

router.patch("/:handle", ensureAdmin, async(req, res, next) => {
  let handle = req.params.handle
  let data = {
    num_employees: req.body.num_employees,
    description: req.body.description,
    logo_url: req.body.logo,
  }; 

  let input = jsonSchema.validate(data, updateCompanySchema); // validate inputs with schema

  if (!input.valid) {
    // if invalid/incomplete input data - throw error
    let error = new ExpressError("Invalid company fields", 401);
    return next(error);
  }

  try {
    const updateCompany = await Company.update(handle, data); // update db 
    return res.json({ updated: updateCompany });  // update db 
  } catch (err) {
    return next(err);
  }
})

// DELETE - delete company from db

router.delete("/:handle", ensureAdmin, async(req, res, next) => {

  let handle = req.params.handle
  try {
    const deleteCompany = await Company.delete(handle) // delete from db
    return res.json({ message: 'Company deleted' }); // return msg if successful 
  } catch (err) {
    return next(err)
  }
})

module.exports = router;
