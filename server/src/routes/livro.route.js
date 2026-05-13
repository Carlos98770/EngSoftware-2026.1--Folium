import express from "express";
import livroController from "../controllers/livro.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { livroCreateValidator, livroUpdateValidator } from "../validators/livro.validator.js";
import { validate } from "../middlewares/validator.middleware.js";

const livroRouter = express.Router();

// Públicas
livroRouter.get("/livros", livroController.findAll);
livroRouter.get("/livros/:id", livroController.findById);

// Autenticadas
livroRouter.post("/livros", authMiddleware, livroCreateValidator, validate, livroController.create);
livroRouter.put("/livros/:id", authMiddleware, livroUpdateValidator, validate, livroController.update);
livroRouter.delete("/livros/:id", authMiddleware, livroController.delete);

export default livroRouter;
