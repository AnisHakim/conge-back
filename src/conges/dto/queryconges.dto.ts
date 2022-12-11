import { IsBooleanString, IsNotEmpty, IsNumberString } from "class-validator"

export class QueryConges {
    user: string
    project: any
    status: string
    authorization: boolean
    half_day: boolean
    paid: boolean
    @IsNotEmpty()
    @IsBooleanString()
    isAccepted: boolean
    @IsNotEmpty()
    @IsNumberString()
    pageIndex: number
    startDate: Date
    endDate: Date
}