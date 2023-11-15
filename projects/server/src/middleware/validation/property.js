const { body, validationResult } = require('express-validator');

exports.propertyRules = [
  body('name').notEmpty().withMessage('Name cannot be empty.'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID cannot be empty.')
    .isInt()
    .withMessage('Category ID must be a number.'),
  body('tenantId')
    .notEmpty()
    .withMessage('Tenant ID cannot be empty.')
    .isInt()
    .withMessage('Tenant ID must be a number.'),
  body('description').notEmpty().withMessage('Description cannot be empty.'),
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
