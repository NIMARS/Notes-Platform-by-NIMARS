import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validate(registerSchema, "body"), authController.register);
router.post("/login", validate(loginSchema, "body"), authController.login);
router.get("/me", authenticate, authController.me);

export default router;
