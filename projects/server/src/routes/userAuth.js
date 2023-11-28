const router = require('express').Router();
const userAuthController = require('../controller/userAuth');
const userAuthValidator = require('../middleware/validation/userAuth');
const { multerUpload } = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');

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
  '/profile/upload/profile-picture',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  multerUpload.single('profilePicture'),
  userAuthController.uploadProfilePicture
);
router.get('/email/:id', userAuthController.getEmail);
router.get('/profile/:id', userAuthController.getUserProfile);
router.put(
  '/profile',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  userAuthController.editUserProfile
);
router.put(
  '/profile/change-password',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  userAuthController.changePassword
);

module.exports = router;
