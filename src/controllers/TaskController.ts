import { NextFunction, Request, Response } from "express";
import { JobRunnerService } from "../services/JobRunnerService";
import { TaskService } from "../services/TaskService";
import Debug from 'debug';

const debug = Debug(`App:TaskController`);
export class TaskController {
    static async getAllTasks(req: Request, res: Response, next: NextFunction) {
        debug(`getting all tasks`);
        const tasks = await TaskService.getAllTasks();
        res.send(tasks);
    }
    static async getTask(req: Request, res: Response, next: NextFunction) {
        debug(`getting one task with id`, req.params.id);
        const task = await TaskService.getOneTask(req.params.id)
        if(!task) {
            res.status(404).json({message: `task not found`})
        } else {
            res.json(task);
        }
    }
    static async updateTask(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.id;
        debug(`updating task with id: ${taskId}`);
        const {jobId, scheduleDate, scheduleRecurring } = req.body;
        if(!jobId) {
            res.status(400).json({error: `property jobId is mandatory`});
            return next();
        }
        if(!scheduleRecurring && !scheduleDate) {
            res.status(400).json({error: `one of the following properties must be informed: scheduleDate, scheduleRecurring`});
            return next();
        }
        if(!JobRunnerService.checkJobIdExisists(jobId)) {
            res.status(404).json({error: `the provided jobId doesn't exist`});
            return next();
        }
        await TaskService.updateScheduledTask(taskId, jobId, scheduleDate, scheduleRecurring)
        res.status(200).json({message: `job updated successfully`});
    }
    static async createTask(req: Request, res: Response, next: NextFunction) {
        const {jobId, scheduleDate, scheduleRecurring } = req.body;
        debug(`creating task for job: ${jobId}`)
        if(!jobId) {
            res.status(400).json({error: `property jobId is mandatory`});
            return next();
        }
        if(!JobRunnerService.checkJobIdExisists(jobId)) {
            res.status(404).json({error: `the provided jobId doesn't exist`});
            return next();
        }
        if(!scheduleDate && !scheduleRecurring) {
            debug(`Found task without schedule. Skipping task creating. Running job inmediately: ${jobId}`)
            JobRunnerService.run(jobId);
            res.status(200).json({message: `job executed successfully`});
        } else {
            debug(`Found task with schedule. Scheduling task for job: ${jobId}`)
            const taskId = await TaskService.scheduleTask(jobId, null, scheduleDate, scheduleRecurring);
            res.status(201).json({message: `task successfully scheduled`, taskId});
        }
    }
    static async deleteTask(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.id;
        debug(`Deleting task with id: ${taskId}`)
        await TaskService.deleteScheduledTask(taskId)
        res.status(200).json({message: `task removed successfully`});
    }
}