import { IsNotEmpty, IsNumberString } from "class-validator"

export class QueryTeleworkDto {
    @IsNotEmpty()
    @IsNumberString()
    pageIndex: number
    startDate: Date
    endDate: Date
    user: string
    status: string
}