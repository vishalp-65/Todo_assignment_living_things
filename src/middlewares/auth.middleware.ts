// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/error.utils"
import { AppDataSource } from "../config/database"
import { User } from "../entities/user.entity"
import { verifyToken } from "../utils/jwt.utils"

// Extend the Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized("Authentication token is required")
        }

        const token = authHeader.split(" ")[1]
        const decodedToken = verifyToken(token)

        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOne({
            where: { id: decodedToken.userId }
        })

        if (!user) {
            throw ApiError.unauthorized("User not found")
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}
