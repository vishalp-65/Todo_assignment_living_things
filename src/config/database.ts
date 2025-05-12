// src/config/database.ts
import { DataSource } from "typeorm"
import { ENV } from "./env"
import { User } from "../entities/user.entity"
import path from "path"
import { Task } from "../entities/task.entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    entities: [User, Task],
    synchronize: ENV.NODE_ENV === "development", // Set to false in production
    logging: ENV.NODE_ENV === "development",
    migrations: [path.join(__dirname, "../migrations/**/*.ts")]
})

export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize()
        console.log("Database connection has been established successfully.")
    } catch (error) {
        console.error("Unable to connect to the database:", error)
        process.exit(1)
    }
}
