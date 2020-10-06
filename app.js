/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const ExpressError = require("./helpers/expressError");

// routes
const companiesRouter = require("./routes/companies");
const authRouter = require("./routes/auth")
const usersRouter = require("./routes/users")
const jobsRoutes = require("./routes/jobs")

const morgan = require("morgan");
const app = express();

app.use(express.json());

// allow connections to all routes from any browser
app.use(cors());

// add logging system
app.use(morgan("tiny"));

// routes
app.use("/companies", companiesRouter);


process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
