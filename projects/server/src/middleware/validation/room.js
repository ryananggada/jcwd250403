const { body, validationResult } = require('express-validator');

exports.roomRules = [
  body('propertyId')
    .notEmpty()
    .withMessage('Property ID cannot be empty.')
    .isInt()
    .withMessage('Property ID must be a number.'),
  body('roomType').notEmpty().withMessage('Room type cannot be empty.'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty.')
    .isInt()
    .withMessage('Price must be a number.'),
  body('description').notEmpty().withMessage('Description cannot be empty.'),
];

exports.applyRoomValidation = (req, res, next) => {
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
