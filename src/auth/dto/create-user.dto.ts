import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: `Email User  
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,`,
        example: 'yola123@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: `Email of login  
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,`,
        example: 'Yol@us_123',
        minLength: 6,
    })
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

    @ApiProperty({
        description: 'Full name of User',
        example: 'Yolaus Godoy',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    fullName: string;


}