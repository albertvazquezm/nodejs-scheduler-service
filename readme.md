# Scheduler Service
Use this service to schedule jobs. A schedule job is called a "Task". It's created using NodeJS, TypeScript, Express and Jest. For the job scheduler, it's using node-schedule.

It stores the tasks in a MongoDB database in order to retrieve them again in case the service stops.

All the terminated jobs are removed automatically from the DB. Additionaly, it has a mechanism for deleting tasks with dates in the past on application start.

## This is a WIP :)

This application a minimal working example and there are areas that need to be improved:

- Validations: Dates in the past or malformed, invalid cron-style strings...
- Unit testing: Coverage is pretty basic
- Logging: There is only minimal logging in place using Debug module.
- End-to-end testing
- Better error handling (404, send detailed error messages...)

## Run

To run the application, execute `npm run start`
To run the tests, execute: `npm run test`

*Configuration*

This project requires configuration to connect to DB. You can use .env file with following variables:

```
MONGO_URI=<your connection string>
PORT=3000
DB=<db name>
DEBUG=* // Check debug module configuration for details
```

## API

This services exposes a REST API for controlling the tasks. **A Task is a scheduled job that will run at a specific time.**

### POST /task

JSON Body

```
{
    jobId: string
    scheduleDate: string (optional) // Date to run the job, in ISO 8601 format
    scheduleRecurring: string (optional) // Cron-style string (see below)
}
```
#### Property description

* If scheduleDate and scheduleRecurring are not informed, **the job will run inmediately**
* scheduleDate and scheduleRecurring are incompatible. You can't define both.

**jobId**

Use the ID of the job you want to run / schedule

Predefined jobs for demo purposes

| ID             | Description                |
|----------------|----------------------------|
| logAnimal      | Logs an animal name        |
| logCompanyName | Logs the name of a company |


**scheduleDate** (Optional)

*To run the job once in a specific date and time*

```
{
    ...
    scheduleDate: "2021-11-25T08:48:45Z"
    ...
}
```

**scheduleRecurring** (Optional)

*To run the job recurrently in a specific time*

```
{
    ...
    scheduleRecurring: "10 * * * * *" // This will run every minute, when the second is "10"
    scheduleRecurring: "0 50 * * * *" // This will run every hour, when the minute is "50"
    ...
}
```
Cron-style string documentation

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

Check out the complete cron-style string documentation here: https://www.npmjs.com/package/node-schedule

### GET /task

Gets all tasks

### GET /task/:id

Gets a specific task

### DELETE /task/:id

Deletes a specific task

### PUT /task/:id

Updates a specific task

```
{
    jobId: string
    scheduleDate: string (optional) // Date to run the job, in ISO 8601 format
    scheduleRecurring: string (optional) // Cron-style string (see below)
}
```

## Logging

This service has minimal debugging in place using "debug" module

## Unit testing

The application has some initial unit testing with Jest




