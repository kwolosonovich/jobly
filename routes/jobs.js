const express = require("express");
const ExpressError = require("../helpers/expressError");
const Job = require("../models/job");

const router = new express.Router();

// GET - all jobs with filter 

router.get("/", async(req, res, next) => {
    try {
        const result = await Job.getAll(req.query)
        return res.json({ result })
    } catch (err) {
        return next(err)
    }
})

// GET - search by id

router.get("/:id", async(req, res, next) => {
    let id = req.params.id
    try {
      const result = await Job.getID(id);
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
})

// POST - add new job 

router.post("/", async(req, res, next) => {
    const data = req.body
    try {
      const result = await Job.add(data);
      return res.json({ job: result });
    } catch (err) {
      return next(err);
    }
})

// PATCH - update job

router.patch("/:id", async(req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const result = await Job.update(id, data);
      return res.json({ job: result });
    } catch (err) {
      return next(err);
    }
})

// DELETE - delete job by id

router.delete("/:id", async(req, res, next) => {
    const id = req.params.id
    try {
      const result = await Job.delete(id);
      return res.json({ message: "Job deleted" });
    } catch (err) {
      return next(err);
    }
})

module.exports = router;
