// src/server.ts
import { createApp } from "./app"
import { ENV } from "./config/env"
import { initializeDatabase } from "./config/database"

async function startServer() {
    try {
        // Initialize database connection
        await initializeDatabase()

        const app = createApp()

        // Start the server
        const server = app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`)
            console.log(`Environment: ${ENV.NODE_ENV}`)
            console.log(
                `API URL: http://localhost:${ENV.PORT}${ENV.API_PREFIX}`
            )
        })

        // Handle unhandled rejections and exceptions
        process.on("unhandledRejection", (reason, promise) => {
            console.error("Unhandled Rejection at:", promise, "reason:", reason)
            // Application specific handling goes here
        })

        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception:", error)
            // Application specific handling goes here

            if (server) {
                server.close(() => {
                    process.exit(1)
                })
            } else {
                process.exit(1)
            }
        })

        // Graceful shutdown
        process.on("SIGTERM", () => {
            console.log("SIGTERM received, shutting down gracefully")

            if (server) {
                server.close(() => {
                    console.log("Process terminated")
                    process.exit(0)
                })
            } else {
                process.exit(0)
            }
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()
