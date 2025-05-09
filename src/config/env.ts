// src/config/env.ts
import dotenv from "dotenv"
import path from "path"

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") })

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    API_PREFIX: process.env.API_PREFIX || "/api",

    // Database
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
    DB_USERNAME: process.env.DB_USERNAME || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "password",
    DB_DATABASE: process.env.DB_DATABASE || "taskmaster_db",

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || "vishalp",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
}
