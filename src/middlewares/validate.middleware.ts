// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express"
import { plainToInstance } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import { ApiError } from "../utils/error.utils"

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dtoObj = plainToInstance(dtoClass, req.body)
            const errors = await validate(dtoObj, {
                whitelist: true,
                forbidNonWhitelisted: true
            })

            if (errors.length > 0) {
                const validationErrors = errors.reduce(
                    (acc: Record<string, string>, error: ValidationError) => {
                        const property = error.property
                        const constraints = error.constraints || {}

                        acc[property] = Object.values(constraints)[0]
                        return acc
                    },
                    {}
                )

                throw ApiError.badRequest(JSON.stringify(validationErrors))
            }

            req.body = dtoObj
            next()
        } catch (error) {
            next(error)
        }
    }
}
