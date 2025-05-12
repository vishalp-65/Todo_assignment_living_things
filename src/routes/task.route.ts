// src/routes/task.routes.ts
import { Router } from "express"
import { TaskController } from "../controllers/task.controller"
import { validateDto } from "../middlewares/validate.middleware"
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto"
import { authenticate } from "../middlewares/auth.middleware"
import multer from "multer"

const router = Router()
const taskController = new TaskController()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only Excel and CSV files
        if (
            file.mimetype ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype === "application/vnd.ms-excel" ||
            file.mimetype === "text/csv"
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error("Only Excel and CSV files are allowed"))
        }
    }
})

// Apply authentication middleware to all task routes
router.use(authenticate)

// Task CRUD routes
router.post("/", validateDto(CreateTaskDto), taskController.createTask)
router.get("/", taskController.getAllTasks)
router.get("/:id", taskController.getTaskById)
router.put("/:id", validateDto(UpdateTaskDto), taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

// Export and import routes
router.get("/export/excel", taskController.exportToExcel)
router.post("/import", upload.single("file"), taskController.importTasks)

export default router
