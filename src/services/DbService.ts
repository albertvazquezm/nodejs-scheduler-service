import { MongoClient, ObjectId } from "mongodb";
import { DbTask } from "../types/DbTypes";
import Debug from 'debug';

let client: MongoClient;
const db = process.env.DB;
const TASK_COLLECTION = `task`;

const debug = Debug(`App:DbService`);
export class DbService {
    static connect(uri: string) {
        if(client) {
            debug(`Couldn't connect. Already connected`);
            return Promise.reject(`Could't connect. Already connected.`)
        }
        client = new MongoClient(uri);
        return client.connect();
    }
    static createTask(jobId: string, scheduleDate: string | null, scheduleRecurring: string | null): Promise<string> {
        debug(`Creating task`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).insertOne({jobId, scheduleDate, scheduleRecurring}).then(result => result.insertedId.toString());
    }
    static getTask(taskId: string) {
        debug(`Getting task`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).findOne({_id: new ObjectId(taskId)});
    }
    static updateTask(jobId: string, taskId: string, scheduleDate?: string, scheduleRecurring?: string): Promise<DbTask | null> {
        debug(`Updating task ${taskId}`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).findOneAndUpdate({_id: new ObjectId(taskId)}, {$set: {jobId, scheduleDate, scheduleRecurring}}, {returnDocument: 'after'}).then(result => result.value);
    }
    static getAllTasks(): Promise<DbTask[]> {
        debug(`Getting all tasks`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).find().toArray();
    }
    static deleteTask(taskId: string) {
        debug(`Deleting task ${taskId}`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).deleteOne({_id: new ObjectId(taskId)})
    }
    static deleteAllTasksWithScheduleDateInPast() {
        debug(`Deleting all tasks with schedule date in past`);
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection<DbTask>(TASK_COLLECTION).deleteMany({scheduleDate: {"$lte": new Date(Date.now()).toISOString()}})
    }
}