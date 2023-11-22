const router = require('express').Router();
const verifyController = require('../controller/verify');

router.post('/:id', verifyController.verifyAccount);
router.get('/resend/:id', verifyController.resendOtp);

module.exports = router;
