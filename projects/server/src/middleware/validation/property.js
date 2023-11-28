const { check, validationResult } = require('express-validator');

exports.propertyRules = [
  check('name').notEmpty().withMessage('Name cannot be empty.'),
  check('categoryId')
    .notEmpty()
    .withMessage('Category ID cannot be empty.')
    .isInt()
    .withMessage('Category ID must be a number.'),
  check('description').notEmpty().withMessage('Description cannot be empty.'),
];

exports.applyPropertyValidation = (req, res, next) => {
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
