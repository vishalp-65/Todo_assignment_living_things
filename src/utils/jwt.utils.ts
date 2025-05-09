// src/utils/jwt.utils.ts
import jwt from "jsonwebtoken"
import { ENV } from "../config/env"
import { ApiError } from "./error.utils"

export interface JwtPayload {
    userId: string
    email: string
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn:
            typeof ENV.JWT_EXPIRES_IN === "string"
                ? parseInt(ENV.JWT_EXPIRES_IN, 10)
                : ENV.JWT_EXPIRES_IN
    })
}

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload
    } catch (error) {
        throw ApiError.unauthorized("Invalid or expired token")
    }
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload
    } catch (error) {
        return null
    }
}

// export const isTokenExpired = (token: string): boolean => {
//     const decoded = decodeToken(token)
//     if (!decoded) {
//         return true
//     }
//     const currentTime = Math.floor(Date.now() / 1000)
//     return decoded.exp ? decoded.exp < currentTime : false
// }
