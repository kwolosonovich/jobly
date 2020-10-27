function validateSchema(schema) {
  return function (req, res, next) {
    let input = jsonSchema.validate(req.body, schema); // validate inputs with schema

    if (!input.valid) {
      // if invalid/incomplete input data - throw error
      let error = new ExpressError("Invalid fields", 401);
      return next(error);
    }

    return next();
  };
}
