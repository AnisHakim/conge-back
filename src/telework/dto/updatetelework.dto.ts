import { IsEnum, } from "class-validator";

export enum statusTelework {
    inProgress = 'inProgress',
    accepted = 'accepted',
    refused = 'refused'
}
export class UpdateTeleworkDto {
    @IsEnum(statusTelework)
    status: statusTelework;
}

