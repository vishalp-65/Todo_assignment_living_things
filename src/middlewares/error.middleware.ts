// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express"
import httpStatus from "http-status"
import { ApiError } from "../utils/error.utils"
import { ENV } from "../config/env"
import { errorResponse } from "../utils/response.utils"

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"

    if (err instanceof ApiError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err.name === "ValidationError") {
        statusCode = httpStatus.BAD_REQUEST
        message = err.message
    } else if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError"
    ) {
        statusCode = httpStatus.UNAUTHORIZED
        message = "Invalid or expired token"
    }

    const response = errorResponse(message)

    if (ENV.NODE_ENV === "development") {
        response.meta = {
            stack: err.stack
        }
    }

    res.status(statusCode).json(response)
}

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(httpStatus.NOT_FOUND).json(
        errorResponse(`Cannot ${req.method} ${req.originalUrl}`)
    )
}
