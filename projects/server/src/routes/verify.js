const router = require('express').Router();
const verifyController = require('../controller/verify');

router.post('/:token', verifyController.verifyAccount);
router.get('/email/:token', verifyController.getUserEmail);
router.get('/resend/:token', verifyController.resendOtp);

module.exports = router;
