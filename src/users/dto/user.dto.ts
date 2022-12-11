import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "src/role/role.enum";

export class UserDto {
    name: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
    readonly roles: Role[];
    start: string;
    pay: number;
    id: string;
    isReportSold: boolean;
    isFullTime: boolean;
}
export class FindEmail {
    @IsEmail()
    email: string;
}

