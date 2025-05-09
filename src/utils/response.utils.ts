export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
    meta?: any
}

export const successResponse = <T>(
    message: string,
    data?: T,
    meta?: any
): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
        meta
    }
}

export const errorResponse = (message: string): ApiResponse<null> => {
    return {
        success: false,
        message
    }
}
export const notFoundResponse = (message: string): ApiResponse<null> => {
    return {
        success: false,
        message
    }
}
