const { body, validationResult } = require('express-validator');

exports.tenantSignupRules = [
  body('name').notEmpty().withMessage('Name cannot be empty.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 length, have at least one uppercase, lowercase, number and symbol.'
    ),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Phone number must be in valid format.'),
];

exports.tenantLoginRules = [
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 length, have at least one uppercase, lowercase, number and symbol.'
    ),
];

exports.applyTenantAuthValidation = (req, res, next) => {
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
