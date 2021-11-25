import { DbService } from "./DbService";
import { Job, scheduleJob } from "node-schedule";
import { JobRunnerService } from "./JobRunnerService";
import Debug from 'debug';

const debug = Debug(`App:TaskService`);

const localScheduledJobs = new Map<string, Job>();

export class TaskService {
    static async scheduleTask(jobId: string, existingTaskId: string | null, scheduleDate?: string, scheduleRecurring?: string): Promise<string> {
        debug(`scheduling task`)
        const taskId = existingTaskId || await DbService.createTask(jobId, scheduleDate, scheduleRecurring);
        if (scheduleDate) {
            debug(`detected task with scheduleDate`)
            localScheduledJobs.set(taskId, scheduleJob(scheduleDate, () => {
                JobRunnerService.run(jobId);
                DbService.deleteTask(taskId)
            }));
        } else {
            debug(`detected task with scheduleRecurring`)
            localScheduledJobs.set(taskId, scheduleJob(scheduleRecurring!, () => JobRunnerService.run(jobId)));
        }
        return existingTaskId || taskId
    }
    static async scheduleAllTasksFromDb() {
        debug(`scheduling all tasks from DB`)
        const tasks = await DbService.getAllTasks();
        return Promise.all(tasks.map(task => TaskService.scheduleTask(task.jobId, task._id.toString(), task.scheduleDate, task.scheduleRecurring)))
    }
    static async deleteScheduledTask(taskId: string) {
        debug(`deleting scheduled task ${taskId}`)
        if (!localScheduledJobs.has(taskId)) {
            throw new Error(`Shceduled task not found for given taskId`)
        }
        await DbService.deleteTask(taskId);
        localScheduledJobs.get(taskId)!.cancel();
        localScheduledJobs.delete(taskId)
    }
    static async updateScheduledTask(taskId: string, jobId: string, scheduleDate: string, scheduleRecurring: string) {
        debug(`updating scheduled task ${taskId}`)
        if (!localScheduledJobs.has(taskId)) {
            throw new Error(`Shceduled task not found for given taskId`)
        }
        const updatedTask = await DbService.updateTask(jobId, taskId, scheduleDate, scheduleRecurring);
        if (!updatedTask) {
            throw new Error(`Scheduled task not found in DB`)
        }
        localScheduledJobs.get(updatedTask._id.toString())!.cancel();
        localScheduledJobs.delete(updatedTask._id.toString())
        TaskService.scheduleTask(updatedTask.jobId, updatedTask._id.toString(), updatedTask.scheduleDate, updatedTask.scheduleRecurring)
    }
    static getAllTasks() {
        debug(`getting all tasks`)
        return DbService.getAllTasks()
    }
    static getOneTask(taskId: string) {
        debug(`getting one task`)
        return DbService.getTask(taskId);
    }
}