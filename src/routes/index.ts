// src/routes/index.ts
import { Router } from "express"
import authRoutes from "./auth.route"
import taskRoutes from "./task.route"

const router = Router()

// Root route
router.get("/", (req, res) => {
    res.json({
        message: "TaskMaster API is running",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    })
})

// Mount routes
router.use("/auth", authRoutes)
router.use("/task", taskRoutes)

export default router
