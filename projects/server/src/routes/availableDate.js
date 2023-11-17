const router = require('express').Router();
const availableDateController = require('../controller/availableDate');

router.get('/:id', availableDateController.getAvailableDates);
router.post('/:id', availableDateController.addAvailableDate);

module.exports = router;
