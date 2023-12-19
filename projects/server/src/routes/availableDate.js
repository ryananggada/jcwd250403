const router = require('express').Router();
const availableDateController = require('../controller/availableDate');
const authMiddleware = require('../middleware/auth');
const availableDateValidator = require('../middleware/validation/availableDate');

router.get(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  availableDateController.getAvailableDates
);
router.post(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  availableDateValidator.availableDateRules,
  availableDateValidator.applyAvailableDateValidation,
  availableDateController.addAvailableDate
);

module.exports = router;
