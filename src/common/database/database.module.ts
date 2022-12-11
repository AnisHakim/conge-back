import { Module } from "@nestjs/common";
import { DataBaseProviders } from "./database.provider";

@Module({
    providers:[...DataBaseProviders],
    exports:[...DataBaseProviders]
})
export class DatabaseModule{}
