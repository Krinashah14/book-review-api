const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res) => {
  const { title, author, genre } = req.body;
  const book = await Book.create({ title, author, genre });
  res.status(201).json(book);
};

exports.getBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate({
    path: 'reviews',
    options: {
      limit: parseInt(req.query.limit) || 10,
      skip: ((parseInt(req.query.page) || 1) - 1) * (parseInt(req.query.limit) || 10),
    },
  });
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const averageRating =
    book.reviews.reduce((sum, review) => sum + review.rating, 0) /
    (book.reviews.length || 1);

  res.json({ ...book.toObject(), averageRating });
};

exports.searchBooks = async (req, res) => {
  const { query } = req.query;
  const books = await Book.find({
    $or: [
      { title: new RegExp(query, 'i') },
      { author: new RegExp(query, 'i') },
    ],
  });
  res.json(books);
};
