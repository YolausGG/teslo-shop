import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class LoginUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(100)
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    })
    password: string;

}
