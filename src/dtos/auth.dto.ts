// src/dtos/auth.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches
} from "class-validator"

export class RegisterDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be valid" })
    email: string

    @IsNotEmpty({ message: "Password is required" })
    @IsString({ message: "Password must be a string" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    )
    password: string

    @IsNotEmpty({ message: "First name is required" })
    @IsString({ message: "First name must be a string" })
    firstName: string

    @IsNotEmpty({ message: "Last name is required" })
    @IsString({ message: "Last name must be a string" })
    lastName: string
}

export class LoginDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be valid" })
    email: string

    @IsNotEmpty({ message: "Password is required" })
    @IsString({ message: "Password must be a string" })
    password: string
}
