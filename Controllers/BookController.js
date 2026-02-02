import BookService from "../Services/BookService.js";
import container from "../config/container.js";

class BookController {
  constructor() {
    this.bookService = container.getService(BookService);
  }

  async createBook(req, res, next) {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  }

  async getAllBooks(req, res, next) {
    try {
      const query = req.validatedQuery || req.query;
      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '10', 10);
      
      const result = await this.bookService.getAllBooks(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getBookById(req, res, next) {
    try {
      const params = req.validatedParams || req.params;
      const book = await this.bookService.getBookById(Number(params.id));
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (err) {
      next(err);
    }
  }

  async updateBook(req, res, next) {
    try {
      const params = req.validatedParams || req.params;
      const book = await this.bookService.updateBook(Number(params.id), req.body);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req, res, next) {
    try {
      const params = req.validatedParams || req.params;
      await this.bookService.deleteBook(Number(params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new BookController();
