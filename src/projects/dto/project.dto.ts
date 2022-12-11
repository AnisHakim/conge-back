import { IsNotEmpty } from "class-validator";

export class ProjectDTO {
    id: string
    @IsNotEmpty()
    name: string;
    scrum: string;
    po: string;
    techLead: string;
    teamLead: string;
    rh: string;
    admin: string;
    marketing: string;
    startDate: Date;
    endDate: Date;
}