// src/routes/auth.routes.ts
import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { validateDto } from "../middlewares/validate.middleware"
import { RegisterDto, LoginDto } from "../dtos/auth.dto"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()
const authController = new AuthController()

// Register route
router.post("/register", validateDto(RegisterDto), authController.register)

// Login route
router.post("/login", validateDto(LoginDto), authController.login)

// Get user profile route
router.get("/profile", authenticate, authController.getProfile)

export default router
