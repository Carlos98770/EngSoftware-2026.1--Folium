import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { userCreateValidator, userUpdateValidator } from "../validators/user.validator.js";
import { validate } from "../middlewares/validator.middleware.js";

const userRouter = express.Router();

// Públicas
userRouter.post("/usuarios", userCreateValidator, validate, userController.create);

// Autenticadas
userRouter.get("/usuarios", authMiddleware, userController.findAll);
userRouter.get("/usuarios/:id", authMiddleware, userController.findById);
userRouter.put("/usuarios/:id", authMiddleware, userUpdateValidator, validate, userController.update);
userRouter.delete("/usuarios/:id", authMiddleware, userController.delete);

// Admin only
userRouter.patch("/usuarios/:id/promover", authMiddleware, adminMiddleware, userController.promoteToAdmin);
userRouter.patch("/usuarios/:id/rebaixar", authMiddleware, adminMiddleware, userController.demoteToUser);

export default userRouter;
