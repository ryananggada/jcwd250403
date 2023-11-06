const { body, validationResult } = require('express-validator');

exports.categoryRules = [
  body('location').notEmpty().withMessage('Category cannot be empty.'),
];

exports.applyCategoryValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: 'Failed data validation',
      errors: result.errors,
    });
  }

  next();
};
