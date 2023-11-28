const router = require('express').Router();
const availableDateController = require('../controller/availableDate');
const authMiddleware = require('../middleware/auth');

router.get('/:id', availableDateController.getAvailableDates);
router.post(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  availableDateController.addAvailableDate
);

module.exports = router;
