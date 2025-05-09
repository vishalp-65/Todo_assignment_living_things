// src/services/auth.service.ts
import { Repository } from "typeorm"
import { User } from "../entities/user.entity"
import { RegisterDto, LoginDto } from "../dtos/auth.dto"
import { ApiError } from "../utils/error.utils"
import { generateToken } from "../utils/jwt.utils"
import { AppDataSource } from "../config/database"

export class AuthService {
    private userRepository: Repository<User>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    async register(
        registerDto: RegisterDto
    ): Promise<{ user: User; token: string }> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw ApiError.conflict("User with this email already exists")
        }

        // Create new user
        const user = this.userRepository.create({
            email: registerDto.email,
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName
        })

        await this.userRepository.save(user)

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email
        })

        // Remove sensitive data before returning
        delete (user as Partial<User>).password

        return { user, token }
    }

    async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
        // Find user by email
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        })

        if (!user) {
            throw ApiError.unauthorized("Invalid email or password")
        }

        // Validate password
        const isPasswordValid = await user.validatePassword(loginDto.password)

        if (!isPasswordValid) {
            throw ApiError.unauthorized("Invalid email or password")
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email
        })

        // Remove sensitive data before returning
        delete (user as Partial<User>).password

        return { user, token }
    }

    async getUserProfile(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        })

        if (!user) {
            throw ApiError.notFound("User not found")
        }

        // Remove sensitive data before returning
        delete (user as Partial<User>).password

        return user
    }
}
