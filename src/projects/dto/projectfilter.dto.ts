import { IsNotEmpty, IsNumberString } from "class-validator"

export class ProjectFilterDto {
    @IsNotEmpty()
    @IsNumberString()
    pageIndex: number
    projectName: string
    scrum: string
    po: string
    teamLead: string
    teckLead: string
}