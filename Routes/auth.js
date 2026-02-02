import express from "express";
import AuthController from "../Controllers/AuthController.js";
import { validate } from "../middleware/validation.js";
import { authSchemas } from "../validators/schemas.js";

const router = express.Router();

router.post("/register", validate(authSchemas.register), AuthController.register.bind(AuthController));
router.post("/login", validate(authSchemas.login), AuthController.login.bind(AuthController));

export default router;
