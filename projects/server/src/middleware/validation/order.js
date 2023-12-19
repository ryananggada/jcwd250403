const { body, validationResult } = require('express-validator');

exports.orderRules = [
  body('roomId')
    .notEmpty()
    .withMessage('Room ID is required.')
    .isInt()
    .withMessage('Room ID must be a number.'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a date.'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required.')
    .isISO8601()
    .withMessage('End date must be a date.'),
  body('totalPrice')
    .notEmpty()
    .withMessage('Total Price is required.')
    .isInt()
    .withMessage('Total price must be a integer.'),
];

exports.applyOrderValidation = (req, res, next) => {
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
