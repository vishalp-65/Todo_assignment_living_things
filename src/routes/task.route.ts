// src/routes/task.routes.ts
import { Router } from "express"
import { TaskController } from "../controllers/task.controller"
import { validateDto } from "../middlewares/validate.middleware"
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()
const taskController = new TaskController()

// Apply authentication middleware to all task routes
router.use(authenticate)

// Task CRUD routes
router.post("/", validateDto(CreateTaskDto), taskController.createTask)
router.get("/", taskController.getAllTasks)
router.get("/:id", taskController.getTaskById)
router.put("/:id", validateDto(UpdateTaskDto), taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

export default router