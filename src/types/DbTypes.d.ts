import { ObjectId } from "mongodb";

export interface DbTask {
    _id: ObjectId;
    jobId: string;
    scheduleDate?: string;
    scheduleRecurring?: string;
}