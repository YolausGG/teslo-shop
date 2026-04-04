import { IsObject, IsString, MinLength } from "class-validator";
// import { Socket } from "socket.io";


export class NewMessageDto {

    // @IsObject()
    // client:Socket

    @IsString()
    @MinLength(1)
    message:string;

}