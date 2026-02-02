import express from "express";
import CheckoutController from "../Controllers/CheckoutController.js";
import { validate } from "../middleware/validation.js";
import { checkoutSchemas } from "../validators/schemas.js";

const router = express.Router();

router.post(
  "/borrow",
  validate(checkoutSchemas.checkout),
  CheckoutController.checkoutBook.bind(CheckoutController)
);

router.post(
  "/return",
  validate(checkoutSchemas.return),
  CheckoutController.returnBook.bind(CheckoutController)
);

router.get(
  "/myBooks",
  CheckoutController.myBooks.bind(CheckoutController)
);

router.get(
  "/overdue",
  CheckoutController.overdue.bind(CheckoutController)
);

export default router;
