const router = require('express').Router();
const reviewController = require('../controller/review');

router.get('/user/:id', reviewController.getReviewsFromUser);
router.get('/property/:id', reviewController.getReviewsFromProperty);
router.put('/:id', reviewController.createReview);

module.exports = router;
