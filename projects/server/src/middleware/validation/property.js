const { body, validationResult } = require('express-validator');

exports.propertyRules = [
  body('name').notEmpty().withMessage('Name cannot be empty.'),
  body('categoryId').isInt().withMessage('Category ID must be a number.'),
  body('tenantId').isInt().withMessage('Tenant ID must be a number.'),
  body('description').notEmpty().withMessage('Description cannot be empty.'),
  body('picture').notEmpty().withMessage('Picture must be uploaded.'),
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
