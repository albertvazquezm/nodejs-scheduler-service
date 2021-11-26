import { ObjectId } from "mongodb";

export const mockDbTasks = [
    {
        _id: new ObjectId("619f748e67d6e1b83d9449e5"),
        jobId: 'logCompanyName',
        scheduleDate: null,
        scheduleRecurring: '10 * * * * *'
    },
    {
        _id: new ObjectId("619f749167d6e1b83d9449e6"),
        jobId: 'logCompanyName',
        scheduleDate: null,
        scheduleRecurring: '30 * * * * *'
    },
    {
        _id: new ObjectId("619f749467d6e1b83d9449e7"),
        jobId: 'logCompanyName',
        scheduleDate: null,
        scheduleRecurring: '50 * * * * *'
    }
]