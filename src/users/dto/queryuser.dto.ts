import { IsEmail, IsNotEmpty, IsNumberString, IsOptional } from "class-validator"

export class QueryUserDto {
    @IsNotEmpty()
    @IsNumberString()
    pageIndex: number
    username: string
    @IsOptional()
    @IsEmail()
    email: string
}