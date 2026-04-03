import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(100)
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsString()
    @MinLength(1)
    fullName: string;


}