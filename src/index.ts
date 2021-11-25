import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { TaskController } from './controllers/TaskController';
import { DbService } from './services/DbService';
import { TaskService } from './services/TaskService';
import 'express-async-errors';
import Debug from 'debug';

const debug = Debug(`App:Index`);

debug(`🚀 Starting Scheduler Service...`)

// Constants
const DEFAULT_PORT = 3000;
const REQUIRED_ENV_VARS = ['MONGO_URI', 'DB']

// Check required env vars
if (!REQUIRED_ENV_VARS.every(envVarName => !!process.env[envVarName])) {
    throw new Error(`Fatal error. Missing required environment variable. Required environment variables: ${REQUIRED_ENV_VARS.join(', ')}`)
}

// Express & middlewares
const app = express();
app.use(bodyParser.json());

// Routes
app.get('/task', TaskController.getAllTasks);
app.post('/task', TaskController.createTask);
app.get('/task/:id', TaskController.getTask);
app.put('/task/:id', TaskController.updateTask);
app.delete('/task/:id', TaskController.deleteTask);

// Router exception handlder
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    debug(`Error caught in global error handler.`, err)
    res.status(500).json({ message: 'Internal server error' });
    next(err)
});

// Prerequisites & Start
(async () => {
    try {
        await DbService.connect(process.env.MONGO_URI!);
        await DbService.deleteAllTasksWithScheduleDateInPast();
        await TaskService.scheduleAllTasksFromDb();
    } catch (err) {
        debug(`Error resolving prerequisites. Error: ${err}`);
    }
    debug(`Prerequisites successfully resolved`)
    const port = process.env.PORT || DEFAULT_PORT;
    app.listen(port, () => {
        debug(`🚀 Scheduler Service started in port ${port}`)
    })
})()

