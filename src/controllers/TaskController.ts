import { NextFunction, Request, Response } from "express";
import { DbService } from "../services/DbService";

export class TaskController {
    static async getAllTasks(req: Request, res: Response, next: NextFunction) {
        const tasks = await DbService.getAllTasks()
        res.send(tasks);
    }
    static getTask(req: Request, res: Response, next: NextFunction) {

    }
    static updateTask(req: Request, res: Response, next: NextFunction) {

    }
    static async createTask(req: Request, res: Response, next: NextFunction) {
        await DbService.createTask()
        res.send(`suceed`)
    }
    static deleteTask(req: Request, res: Response, next: NextFunction) {

    }
}