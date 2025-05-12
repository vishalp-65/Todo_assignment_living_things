// src/services/task.service.ts
import { Repository } from "typeorm"
import { Task } from "../entities/task.entity"
import { User } from "../entities/user.entity"
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto"
import { ApiError } from "../utils/error.utils"
import { AppDataSource } from "../config/database"
import { csvToTasks, excelToTasks, tasksToExcel } from "../utils/file.utils"

export class TaskService {
    private taskRepository: Repository<Task>

    constructor() {
        this.taskRepository = AppDataSource.getRepository(Task)
    }

    async createTask(
        userId: string,
        createTaskDto: CreateTaskDto
    ): Promise<Task> {
        // Create new task
        const task = this.taskRepository.create({
            ...createTaskDto,
            dueDate: new Date(createTaskDto.dueDate),
            userId
        })

        return this.taskRepository.save(task)
    }

    async getAllTasks(userId: string): Promise<Task[]> {
        return this.taskRepository.find({
            where: { userId },
            order: { createdAt: "DESC" }
        })
    }

    async getTaskById(taskId: string, userId: string): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, userId }
        })

        if (!task) {
            throw ApiError.notFound("Task not found")
        }

        return task
    }

    async updateTask(
        taskId: string,
        userId: string,
        updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        const task = await this.getTaskById(taskId, userId)

        // Update task properties
        if (updateTaskDto.title) task.title = updateTaskDto.title
        if (updateTaskDto.description !== undefined)
            task.description = updateTaskDto.description
        if (updateTaskDto.effortToComplete)
            task.effortToComplete = updateTaskDto.effortToComplete
        if (updateTaskDto.dueDate)
            task.dueDate = new Date(updateTaskDto.dueDate)
        if (updateTaskDto.isCompleted !== undefined)
            task.isCompleted = updateTaskDto.isCompleted
        if (updateTaskDto.taskStatus !== undefined)
            task.status = updateTaskDto.taskStatus[0]

        return this.taskRepository.save(task)
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this.getTaskById(taskId, userId)
        await this.taskRepository.remove(task)
    }

    async exportToExcel(userId: string): Promise<Buffer> {
        const tasks = await this.getAllTasks(userId)
        return tasksToExcel(tasks)
    }

    async importFromExcel(
        userId: string,
        file: Express.Multer.File
    ): Promise<Task[]> {
        // Check file type
        const fileType = file.mimetype
        let taskDtos: CreateTaskDto[]

        if (
            fileType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            fileType === "application/vnd.ms-excel"
        ) {
            // Excel file
            const user = { id: userId } as User
            taskDtos = excelToTasks(file.buffer, user)
        } else if (fileType === "text/csv") {
            // CSV file
            const user = { id: userId } as User
            taskDtos = csvToTasks(file.buffer, user)
        } else {
            throw ApiError.badRequest(
                "Invalid file format. Only Excel and CSV files are supported."
            )
        }

        // Validate and save tasks
        const tasks: Task[] = []
        for (const taskDto of taskDtos) {
            const task = await this.createTask(userId, taskDto)
            tasks.push(task)
        }

        return tasks
    }
}
