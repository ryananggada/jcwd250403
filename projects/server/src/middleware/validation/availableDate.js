const { body, validationResult } = require('express-validator');

exports.availableDateRules = [
  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Must be in a date form.'),
  body('pricePercentage')
    .notEmpty()
    .withMessage('Price perecentage is required.')
    .isFloat()
    .withMessage('Price percentage must be in float form.'),
];

exports.applyAvailableDateValidation = (req, res, next) => {
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
