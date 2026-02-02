import express from "express";
import BorrowerController from "../Controllers/BorrowerController.js";
import { validate } from "../middleware/validation.js";
import { borrowerSchemas } from "../validators/schemas.js";

const router = express.Router();

router.put(
  "/me",
  validate(borrowerSchemas.update),
  BorrowerController.update.bind(BorrowerController)
);

router.delete(
  "/me",
  BorrowerController.delete.bind(BorrowerController)
);

router.get(
  "/",
  BorrowerController.listAll.bind(BorrowerController)
);

export default router;
