import CheckoutService from "../Services/CheckoutService.js";
import container from "../config/container.js";

class CheckoutController {
  constructor() {
    this.checkoutService = container.getService(CheckoutService);
  }

  async checkoutBook(req, res, next) {
    try {
      const { isbn } = req.body;
      const data = await this.checkoutService.checkoutBook(req.user.id, isbn);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  async returnBook(req, res, next) {
    try {
      const { isbn } = req.body;
      await this.checkoutService.returnBook(req.user.id, isbn);
      res.json({ message: "Book returned" });
    } catch (err) {
      next(err);
    }
  }

  async myBooks(req, res, next) {
    try {
      const books = await this.checkoutService.myBooks(req.user.id);
      res.json(books);
    } catch (err) {
      next(err);
    }
  }

  async overdue(req, res, next) {
    try {
      const books = await this.checkoutService.overdueBooks();
      res.json(books);
    } catch (err) {
      next(err);
    }
  }
}

export default new CheckoutController();
