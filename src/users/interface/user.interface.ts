import { Document } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    roles: string;
    start: string;
    pay: number;
    isReportSold: boolean;
    isFullTime: boolean;
}
