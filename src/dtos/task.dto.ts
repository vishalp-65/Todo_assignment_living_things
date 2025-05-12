// src/dtos/task.dto.ts
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    Min,
    IsBoolean,
    IsEnum
} from "class-validator"
import { Type } from "class-transformer"
import { taskStatus } from "../constant/enums"

export class CreateTaskDto {
    @IsNotEmpty({ message: "Title is required" })
    @IsString({ message: "Title must be a string" })
    title: string

    @IsOptional()
    @IsString({ message: "Description must be a string" })
    description?: string

    @IsNotEmpty({ message: "Effort to complete is required" })
    @IsNumber({}, { message: "Effort to complete must be a number" })
    @Min(0.1, { message: "Effort to complete must be at least 0.1 days" })
    @Type(() => Number)
    effortToComplete: number

    @IsNotEmpty({ message: "Due date is required" })
    @IsDateString({}, { message: "Due date must be a valid date" })
    dueDate: string
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: "Title must be a string" })
    title?: string

    @IsOptional()
    @IsString({ message: "Description must be a string" })
    description?: string

    @IsOptional()
    @IsNumber({}, { message: "Effort to complete must be a number" })
    @Min(0.1, { message: "Effort to complete must be at least 0.1 days" })
    @Type(() => Number)
    effortToComplete?: number

    @IsOptional()
    @IsDateString({}, { message: "Due date must be a valid date" })
    dueDate?: string

    @IsOptional()
    @IsBoolean({ message: "Is completed must be a boolean" })
    isCompleted?: boolean

    @IsOptional()
    @IsEnum(taskStatus, { message: "Status must be a valid task status" })
    taskStatus?: typeof taskStatus
}
