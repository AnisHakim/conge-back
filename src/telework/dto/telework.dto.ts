import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

export class TeleworkDto {
    @IsNotEmpty()
    @Prop([Date])
    dates: Date[]
    status: string;
    reason: string
}

