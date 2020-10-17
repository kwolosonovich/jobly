const express = require("express");
const ExpressError = require("../helpers/expressError");
const Job = require("../models/job");
const {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUser,
} = require("../middleware/authenticate");
const jsonSchema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema")
const updateJobSchema = require("../schemas/jobSchema");


const router = new express.Router();

// GET - all jobs with filter 

router.get("/", authenticateJWT, async (req, res, next) => {

  try {
    const result = await Job.getAll(req.query) // query all jobs
    return res.json({
      result
    }) // return array of jobs objects 
  } catch (err) {
    return next(err)
  }
})

// GET - search by id

router.get("/:id", authenticateJWT, async (req, res, next) => {

  let id = req.params.id;
  try {
    const result = await Job.getID(id); // query jobs by company ID
    return res.json({
      result
    }); // return job object 
  } catch (err) {
    return next(err);
  }
});

// POST - add new job 
router.post("/", ensureAdmin, async (req, res, next) => {
  const data = {
    title: req.body.title,
    salary: req.body.salary,
    equity: req.body.equity,
    company_handle: req.body.company_handle
  }

  let input = jsonSchema.validate(data, jobSchema); // validate inputs with schema

  if (!input.valid) {
    // if invalid/incomplete input data - throw error
    let error = new ExpressError("Invalid job fields", 401);
    return next(error);
  }

  try {
    const result = await Job.add(data); // add new job to db
    return res.json({
      job: result
    }); // return job object
  } catch (err) {
    return next(err);
  }
})

// PATCH - update job
router.patch("/:id", ensureAdmin, async (req, res, next) => {
  const id = req.params.id

  const data = {
    title: req.body.title,
    salary: req.body.salary,
    equity: req.body.equity,
    company_handle: req.body.company_handle,
  };

  let result = jsonSchema.validate(data, updateJobSchema); // validate inputs with schema
  // if invalid/incomplete input data - throw error
  if (!result.valid) {
    let error = new ExpressError("Invalid user fields", 401);
    return next(error);
  }

  try {
    const result = await Job.update(id, data); // update existing job in db 
    return res.json({
      job: result
    }); // return updated job object 
  } catch (err) {
    return next(err);
  }
})

// DELETE - delete job by id
router.delete("/:id", ensureAdmin, async (req, res, next) => {
  const id = req.params.id
  try {
    const result = await Job.delete(id); // delete job from db 
    return res.json({
      message: "Job deleted"
    }); // return msg if successful
  } catch (err) {
    return next(err);
  }
})

module.exports = router;