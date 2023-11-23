const router = require('express').Router();
const userAuthController = require('../controller/userAuth');
const userAuthValidator = require('../middleware/validation/userAuth');

router.get('/email/:id', userAuthController.getEmail);
router.post(
  '/signup',
  userAuthValidator.userSignupRules,
  userAuthValidator.applyUserAuthValidation,
  userAuthController.createUser
);
router.post(
  '/login',
  userAuthValidator.userLoginRules,
  userAuthValidator.applyUserAuthValidation,
  userAuthController.loginHandler
);

module.exports = router;
