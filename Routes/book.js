import express from "express";
import BookController from "../Controllers/BookController.js";
import { validate } from "../middleware/validation.js";
import { bookSchemas } from "../validators/schemas.js";

const router = express.Router();

router.post(
  "/create",
  validate(bookSchemas.create),
  BookController.createBook.bind(BookController)
);

router.get(
  "/",
  validate(bookSchemas.pagination, 'query'),
  BookController.getAllBooks.bind(BookController)
);

router.get(
  "/:id",
  validate(bookSchemas.id, 'params'),
  BookController.getBookById.bind(BookController)
);

router.put(
  "/:id",
  validate(bookSchemas.id, 'params'),
  validate(bookSchemas.update),
  BookController.updateBook.bind(BookController)
);

router.delete(
  "/:id",
  validate(bookSchemas.id, 'params'),
  BookController.deleteBook.bind(BookController)
);

export default router;
