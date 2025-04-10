export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const schemaKeys = Object.keys(schema);

    let validationErrors = [];

    for (let key of schemaKeys) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        validationErrors.push(error.details);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "Validation failed",error: validationErrors });
    }

    next();
  };
};