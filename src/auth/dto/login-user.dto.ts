import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'Email of login',
        example: 'yola123@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Email of login',
        example: 'Yol@us_123',
        minLength: 6,
        minimum: 1,
    
    })
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
