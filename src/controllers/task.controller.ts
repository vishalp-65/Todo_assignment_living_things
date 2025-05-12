// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from "express"
import httpStatus from "http-status"
import { TaskService } from "../services/task.service"
import { successResponse } from "../utils/response.utils"
import { ApiError } from "../utils/error.utils"

export class TaskController {
    private taskService: TaskService

    constructor() {
        this.taskService = new TaskService()
    }

    createTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            const task = await this.taskService.createTask(
                req.user.id,
                req.body
            )

            res.status(httpStatus.CREATED).json(
                successResponse("Task created successfully", task)
            )
        } catch (error) {
            next(error)
        }
    }

    getAllTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            const tasks = await this.taskService.getAllTasks(req.user.id)

            res.status(httpStatus.OK).json(
                successResponse("Tasks retrieved successfully", tasks)
            )
        } catch (error) {
            next(error)
        }
    }

    getTaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            const task = await this.taskService.getTaskById(
                req.params.id,
                req.user.id
            )

            res.status(httpStatus.OK).json(
                successResponse("Task retrieved successfully", task)
            )
        } catch (error) {
            next(error)
        }
    }

    updateTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            const updatedTask = await this.taskService.updateTask(
                req.params.id,
                req.user.id,
                req.body
            )

            res.status(httpStatus.OK).json(
                successResponse("Task updated successfully", updatedTask)
            )
        } catch (error) {
            next(error)
        }
    }

    deleteTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated")
            }

            await this.taskService.deleteTask(req.params.id, req.user.id)

            res.status(httpStatus.OK).json(
                successResponse("Task deleted successfully")
            )
        } catch (error) {
            next(error)
        }
    }
}
