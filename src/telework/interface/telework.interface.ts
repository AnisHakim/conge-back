import { Document } from "mongoose";

export interface Telework extends Document {
    dates: Date[]
    user: string
    status: string
    reason: string
}