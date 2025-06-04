const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createBook,
  getBooks,
  getBookById,
  searchBooks,
} = require('../controllers/bookController');

router.post('/books', auth, createBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.get('/search', searchBooks);

module.exports = router;
