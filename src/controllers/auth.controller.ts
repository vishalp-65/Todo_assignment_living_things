// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express"
import httpStatus from "http-status"
import { AuthService } from "../services/auth.service"
import { successResponse } from "../utils/response.utils"

export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.authService.register(req.body)

            res.status(httpStatus.CREATED).json(
                successResponse("User registered successfully", result)
            )
        } catch (error) {
            next(error)
        }
    }

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.authService.login(req.body)

            res.status(httpStatus.OK).json(
                successResponse("Login successful", result)
            )
        } catch (error) {
            next(error)
        }
    }

    getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            const user = await this.authService.getUserProfile(req.user.id)

            res.status(httpStatus.OK).json(
                successResponse("User profile retrieved successfully", user)
            )
        } catch (error) {
            next(error)
        }
    }
}
