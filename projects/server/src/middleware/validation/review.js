const { body, validationResult } = require('express-validator');

exports.reviewRules = [
  body('rating')
    .notEmpty()
    .withMessage('Rating cannot be empty.')
    .isInt()
    .withMessage('Rating must be a number.'),
  body('comment').notEmpty().withMessage('Comment cannot be empty.'),
];

exports.applyReviewValidation = (req, res, next) => {
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
