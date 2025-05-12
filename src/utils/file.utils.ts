// src/utils/file.utils.ts
import xlsx from "xlsx"
import { Task } from "../entities/task.entity"
import { User } from "../entities/user.entity"
import { CreateTaskDto } from "../dtos/task.dto"

// Convert tasks to Excel file
export const tasksToExcel = (tasks: Task[]): Buffer => {
    // Map tasks to a format suitable for Excel
    const data = tasks.map((task) => ({
        Title: task.title,
        Description: task.description || "",
        "Effort To Complete (Days)": task.effortToComplete,
        "Due Date": new Date(task.dueDate).toLocaleDateString(),
        Status: task.status,
        Priority: task.priority,
        Type: task.type,
        Visibility: task.visibility,
        "Created At": new Date(task.createdAt).toLocaleDateString()
    }))

    // Create a workbook and worksheet
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(data)

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Tasks")

    // Generate buffer
    return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" })
}

// Parse Excel file to tasks
export const excelToTasks = (buffer: Buffer, user: User): CreateTaskDto[] => {
    // Parse Excel file
    const workbook = xlsx.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert worksheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet)

    // Map JSON to tasks
    return data.map((row: any) => {
        const dueDate = row["Due Date"] || row["DueDate"] || row["dueDate"]

        // Handle date format - could be a string or a date object
        let dueDateStr: string
        if (dueDate instanceof Date) {
            dueDateStr = dueDate.toISOString().split("T")[0]
        } else if (typeof dueDate === "number") {
            // Excel stores dates as numbers - convert to JS date
            dueDateStr = new Date(Math.round((dueDate - 25569) * 86400 * 1000))
                .toISOString()
                .split("T")[0]
        } else {
            // Try to parse the string date
            dueDateStr = new Date(dueDate).toISOString().split("T")[0]
        }

        return {
            title: row["Title"] || row["title"],
            description: row["Description"] || row["description"] || null,
            effortToComplete: parseFloat(
                row["Effort To Complete (Days)"] || row["effortToComplete"] || 1
            ),
            dueDate: dueDateStr
        } as CreateTaskDto
    })
}

// Parse CSV file to tasks
export const csvToTasks = (buffer: Buffer, user: User): CreateTaskDto[] => {
    // Convert CSV to worksheets using xlsx
    const workbook = xlsx.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert worksheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet)

    // Use the same mapping logic as Excel
    return excelToTasks(buffer, user)
}
