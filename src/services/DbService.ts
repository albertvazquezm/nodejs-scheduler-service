import { MongoClient } from "mongodb";

let client: MongoClient;
const db = process.env.DB;
const TASK_COLLECTION = `task`;
export class DbService {
    static connect(uri: string) {
        if(client) {
            return Promise.reject(`Could't connect. Already connected.`)
        }
        client = new MongoClient(uri);
        return client.connect();
    }
    static createTask() {
        if(!client) {
            throw new Error(`client not initialized`);
        }
        client.db(db).collection(TASK_COLLECTION).insertOne({name: `hello`});
    }
    static getAllTasks() {
        if(!client) {
            throw new Error(`client not initialized`);
        }
        return client.db(db).collection(TASK_COLLECTION).find().toArray();
    }
}