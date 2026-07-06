import { validationResult } from 'express-validator';

/**
 * Middleware to check express-validator results
 * and return 400 with error details if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  next();
};

export default validate;
