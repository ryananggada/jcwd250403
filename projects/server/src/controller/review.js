const { Review, Property, Category, User } = require('../models');

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;

  try {
    const review = await Review.findOne({ where: { id: reviewId } });

    review.rating = rating;
    review.comment = comment;
    review.isDone = true;
    await review.save();

    res.json({ ok: true, data: review });
  } catch (error) {
    res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getReviewsFromProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const reviews = await Review.findAll({
      where: { propertyId: propertyId, isDone: true },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profilePicture'],
      },
      attributes: ['id', 'rating', 'comment'],
    });

    res.json({ ok: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getReviewsFromUser = async (req, res) => {
  const userId = req.profile.id;

  try {
    const reviews = await Review.findAll({
      where: { userId: userId },
      include: {
        model: Property,
        as: 'property',
        attributes: ['id', 'name', 'picture'],
        include: { model: Category, as: 'category' },
      },
      attributes: ['id', 'rating', 'comment', 'isDone'],
    });

    res.json({ ok: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
