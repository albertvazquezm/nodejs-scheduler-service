import { ObjectId } from "mongodb";
import { NextFunction, Response } from "express";
import { Request } from "express-serve-static-core";
import { TaskController } from "../../src/controllers/TaskController";
import { TaskService } from "../../src/services/TaskService";
import { JobRunnerService } from "../../src/services/JobRunnerService";
import { mockDbTasks } from "../mocks/MockDbTasks";

jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/JobRunnerService');

let req: Request, res: Response, next: NextFunction;

beforeEach(() => {
    jest.clearAllMocks();
    req = {
        params: {},
        body: {}
    } as any;
    res = ({
        json: jest.fn(),
        status: jest.fn().mockImplementation(() => res)
    }) as any;
    next = jest.fn();
})

describe(`get all tasks`,() => {
    test(`it should get all tasks`, async () => {
        (TaskService.getAllTasks as jest.MockedFunction<typeof TaskService.getAllTasks>).mockResolvedValue(mockDbTasks)
        await TaskController.getAllTasks(req, res, next);
        expect(res.json).toBeCalledWith(mockDbTasks);
    })
})
describe(`get one task`, () => {
    test(`it should get one task`, async () => {
        req.params.id = `123`;
        (TaskService.getOneTask as jest.MockedFunction<typeof TaskService.getOneTask>).mockResolvedValue(mockDbTasks[0])
        await TaskController.getTask(req, res, next);
        expect(res.json).toBeCalledWith(mockDbTasks[0])
    })
    test(`it should respond with 404 status if the task is not found`, async () => {
        req.params.id = `123`;
        (TaskService.getOneTask as jest.MockedFunction<typeof TaskService.getOneTask>).mockResolvedValue(null)
        await TaskController.getTask(req, res, next);
        expect(res.status).toBeCalledWith(404)
    })
})
describe(`updateTask`, () => {
    test(`it should respond with 400 status if no jobId provided`, async () => {
        req.params.id = `123`;
        req.body = {jobId: null, scheduleDate: `2021-11-25T08:48:45Z`};
        await TaskController.updateTask(req, res, next);
        expect(res.status).toBeCalledWith(400)
    })
    test(`it should respond with 400 status if both scheduleDate and scheduleRecurring are provided`, async () => {
        req.params.id = `123`;
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`, scheduleRecurring: `10 * * * *`};
        await TaskController.updateTask(req, res, next);
        expect(res.status).toBeCalledWith(400)
    })
    test(`it should respond with 400 status if no scheduleDate or scheduleRecurring are provided`, async () => {
        req.params.id = `123`;
        req.body = {jobId: `abc`};
        await TaskController.updateTask(req, res, next);
        expect(res.status).toBeCalledWith(400)
    })
    test(`it should respond with 404 status if jobId doesn't exist`, async () => {
        req.params.id = `123`;
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`};
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(false)
        await TaskController.updateTask(req, res, next);
        expect(res.status).toBeCalledWith(404)
    })
    test(`it should update scheduled task if the validation is correct`, async () => {
        req.params.id = `123`;
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`};
        (TaskService.updateScheduledTask as jest.MockedFunction<typeof TaskService.updateScheduledTask>).mockResolvedValue();
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(true);
        await TaskController.updateTask(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith({message: `job updated successfully`})
    })
})
describe(`createTask`, () => {
    test(`it should respond with 400 status if no jobId provided`, async () => {
        req.body = {jobId: null, scheduleDate: `2021-11-25T08:48:45Z`};
        await TaskController.createTask(req, res, next);
        expect(res.status).toBeCalledWith(400)
    })
    test(`it should respond with 400 status if both scheduleDate and scheduleRecurring are provided`, async () => {
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`, scheduleRecurring: `10 * * * *`};
        await TaskController.createTask(req, res, next);
        expect(res.status).toBeCalledWith(400)
    })
    test(`it should respond with 404 status if jobId doesn't exist`, async () => {
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`};
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(false);
        await TaskController.createTask(req, res, next);
        expect(res.status).toBeCalledWith(404)
    })
    test(`it should run the job inmediately and respond with 200 if no scheduleDate or scheduleRecurring are provided`, async () => {
        req.body = {jobId: `abc`};
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(true);
        await TaskController.createTask(req, res, next);
        expect(JobRunnerService.run).toBeCalledWith(`abc`);
        expect(res.status).toBeCalledWith(200)
    })
    test(`it should schedule the task and respond with 201 if scheduleDate is provided`, async () => {
        req.body = {jobId: `abc`, scheduleDate: `2021-11-25T08:48:45Z`};
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(true);
        await TaskController.createTask(req, res, next);
        expect(JobRunnerService.run).not.toBeCalledWith(`abc`);
        expect(TaskService.scheduleTask).toBeCalledWith(`abc`, null, `2021-11-25T08:48:45Z`, undefined);
        expect(res.status).toBeCalledWith(201)
    })
    test(`it should schedule the task and respond with 201 if scheduleRecurring is provided`, async () => {
        req.body = {jobId: `abc`, scheduleRecurring: `10 * * * * *`};
        (JobRunnerService.checkJobIdExisists as jest.MockedFunction<typeof JobRunnerService.checkJobIdExisists>).mockReturnValue(true);
        await TaskController.createTask(req, res, next);
        expect(JobRunnerService.run).not.toBeCalledWith(`abc`);
        expect(TaskService.scheduleTask).toBeCalledWith(`abc`, null, undefined, `10 * * * * *`);
        expect(res.status).toBeCalledWith(201)
    })
})
describe(`delete task`,() => {
    test(`it should delete all tasks and respond with 200`, async () => {
        req.params.id = `abc`;
        (TaskService.deleteScheduledTask as jest.MockedFunction<typeof TaskService.deleteScheduledTask>).mockResolvedValue()
        await TaskController.deleteTask(req, res, next);
        expect(TaskService.deleteScheduledTask).toBeCalledWith(`abc`)
        expect(res.status).toBeCalledWith(200);
    })
})