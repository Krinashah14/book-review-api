const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  const { content, rating } = req.body;
  const { id: bookId } = req.params;
  const userId = req.user.userId;

  const existingReview = await Review.findOne({ user: userId, book: bookId });
  if (existingReview)
    return res.status(400).json({ error: 'Review already exists' });

  const review = await Review.create({ user: userId, book: bookId, content, rating });
  await Book.findByIdAndUpdate(bookId, { $push: { reviews: review._id } });
  res.status(201).json(review);
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId;

  const review = await Review.findOneAndUpdate(
    { _id: id, user: userId },
    { content, rating },
    { new: true }
  );
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const review = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!review) return res.status(404).json({ error: 'Review not found' });

  await Book.findByIdAndUpdate(review.book, { $pull: { reviews: review._id } });
  res.json({ message: 'Review deleted' });
};
