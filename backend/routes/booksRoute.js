import express from 'express';
import { Book } from '../models/bookModel.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Route for Save a new Book
router.post('/', authMiddleware, async (request, response) => {
  try {
    const { title, author, publishYear } = request.body;
    const userId = request.user.id; // Get user ID from the authenticated request

    if (!title || !author || !publishYear) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const newBook = new Book({ title, author, publishYear, userId });
    await newBook.save();

    return response.status(201).send(newBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// Route for Get All Books from database
router.get('/', authMiddleware, async (request, response) => {
  try {
    const userId = request.user.id; // Get the logged-in user's ID
    const books = await Book.find({ userId }); // Filter books by userId

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Book from database by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put('/:id', async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
