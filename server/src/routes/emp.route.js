import express from "express";
import emprestimoController from "../controllers/emp.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { emprestimoCreateValidator } from "../validators/emp.validator.js";
import { validate } from "../middlewares/validator.middleware.js";

const emprestimoRouter = express.Router();

// Autenticadas
emprestimoRouter.get("/emprestimos", authMiddleware, emprestimoController.findAll);
emprestimoRouter.get("/emprestimos/:id", authMiddleware, emprestimoController.findById);
emprestimoRouter.post("/emprestimos", authMiddleware, emprestimoCreateValidator, validate, emprestimoController.create);
emprestimoRouter.post("/emprestimos/:id/return", authMiddleware, emprestimoController.devolver);

// Admin only
emprestimoRouter.patch("/emprestimos/:id/status", authMiddleware, adminMiddleware, emprestimoController.updateStatus);

export default emprestimoRouter;
