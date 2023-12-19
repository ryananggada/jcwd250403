const router = require('express').Router();
const reviewController = require('../controller/review');
const authMiddleware = require('../middleware/auth');
const reviewValidator = require('../middleware/validation/review');

router.get(
  '/user',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  reviewController.getReviewsFromUser
);
router.get('/property/:id', reviewController.getReviewsFromProperty);
router.put(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  reviewValidator.reviewRules,
  reviewValidator.applyReviewValidation,
  reviewController.createReview
);

module.exports = router;
