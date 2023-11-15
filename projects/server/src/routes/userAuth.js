const router = require('express').Router();
const userAuthController = require('../controller/userAuth');
const userAuthValidator = require('../middleware/validation/userAuth');

router.post(
  '/signup',
  userAuthValidator.userSignupRules,
  userAuthValidator.applyUserAuthValidation,
  userAuthController.createUser
);
router.post('/login', userAuthController.loginHandler);

module.exports = router;