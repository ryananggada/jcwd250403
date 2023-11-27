const router = require('express').Router();
const userAuthController = require('../controller/userAuth');
const userAuthValidator = require('../middleware/validation/userAuth');
const { multerUpload } = require('../middleware/multer');

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
router.post(
  '/profile/:id/upload/profile-picture',
  multerUpload.single('profilePicture'),
  userAuthController.uploadProfilePicture
);
router.get('/email/:id', userAuthController.getEmail);
router.get('/profile/:id', userAuthController.getUserProfile);
router.put('/profile/:id', userAuthController.editUserProfile);

module.exports = router;
