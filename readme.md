# Scheduler Service
Use this service to schedule tasks

## API

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





