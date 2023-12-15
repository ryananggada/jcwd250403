const { Review, Property, Category } = require('../models');

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params.id;

  try {
    const review = await Review.findOne({ where: id });

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
    const reviews = await Review.findAll({ where: { propertyId: propertyId } });

    res.json({ ok: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getReviewsFromUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const reviews = await Review.findAll({
      where: { userId: userId },
      include: {
        model: Property,
        as: 'property',
        include: { model: Category, as: 'category' },
      },
    });

    res.json({ ok: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
