import { Document } from "mongoose";


export interface Project extends Document {
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