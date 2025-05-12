// src/entities/task.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm"
import {
    taskPriority,
    taskStatus,
    taskType,
    taskVisibility
} from "../constant/enums"
import { User } from "./user.entity"

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column({ type: "text", nullable: true })
    description: string

    @Column({ type: "float" })
    effortToComplete: number // In days

    @Column({ type: "date" })
    dueDate: Date

    @Column({
        type: "enum",
        enum: taskStatus,
        default: "open"
    })
    status: string

    @Column({
        type: "enum",
        enum: taskPriority,
        default: "low"
    })
    priority: string

    @Column({
        type: "enum",
        enum: taskType,
        default: "task"
    })
    type: string

    @Column({
        type: "enum",
        enum: taskVisibility,
        default: "private"
    })
    visibility: string

    @Column({ default: false })
    isCompleted: boolean

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User

    @Column()
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
