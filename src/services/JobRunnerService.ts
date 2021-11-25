import {logAnimalJob, logCompanyNameJob} from '../jobs';
import Debug from 'debug';

const debug = Debug(`App:DbService`);

enum JobList {
    LogAnimal = 'logAnimal',
    LogCompanyName = 'logCompanyName'
}

export class JobRunnerService {
    static run(jobId: string) {
        debug(`Running job ${jobId}`);
        switch(jobId) {
            case JobList.LogAnimal: logAnimalJob(); break;
            case JobList.LogCompanyName: logCompanyNameJob(); break;
            default: debug(`No job found for given id: ${jobId}`);
        }
    }
    static checkJobIdExisists(jobId: string) {
        debug(`Checking if job ${jobId} exists`);
        return Object.values<string>(JobList).includes(jobId)
    }
}