// src/app.ts
import express, { Application } from "express"
import cors from "cors"
import helmet from "helmet"
import { ENV } from "./config/env"
import routes from "./routes"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware"

export const createApp = (): Application => {
    const app: Application = express()

    // Apply middleware
    app.use(helmet())
    app.use(
        cors({
            origin: ENV.CORS_ORIGIN,
            credentials: true
        })
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // Mount API routes
    app.use(ENV.API_PREFIX, routes)

    // Apply error handling middleware
    app.use(notFoundHandler)
    app.use(errorHandler)

    return app
}
