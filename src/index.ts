import express from 'express';
import { TaskController } from './controllers/TaskController';
import { DbService } from './services/DbService';

const DEFAULT_PORT = 3000;
const REQUIRED_ENV_VARS = ['MONGO_URI']

// Check required env vars
if (!REQUIRED_ENV_VARS.every(envVarName => !!process.env[envVarName])) {
    throw new Error(`Fatal error. Missing required environment variable. Required environment variables: ${REQUIRED_ENV_VARS.join(', ')}`)
}

// Router
const app = express();
app.get('/task', TaskController.getAllTasks);
app.post('/task', TaskController.createTask);
app.get('/task/:id', TaskController.getTask);
app.put('/task/:id', TaskController.updateTask);
app.delete('/task/:id', TaskController.deleteTask);

// Prerequisites & Start
Promise.all([
    DbService.connect(process.env.MONGO_URI!),
]).then(() => {
    const port = process.env.port || DEFAULT_PORT;
    app.listen(port, () => {
        console.log(`🚀 Scheduler Service running in port ${port}`)
    })
}, (err) => {
    console.log(`Error resolving prerequisites. Error: ${err}`)
})

