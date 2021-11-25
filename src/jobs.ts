import Debug from 'debug';

export const logAnimalJob = () => {
    const debug = Debug(`App:Jobs:LogAnimalJob`);
    logWithTime(debug, pickRandomFromArray<string>([`Giraffe`, `Elephant`, `Lion`, `Snake`]))
}

export const logCompanyNameJob = () => {
    const debug = Debug(`App:Jobs:LogCompanyNameJob`);
    logWithTime(debug, pickRandomFromArray<string>([`Apple`, `A Team`, `NASA`, `Microsoft`]))
}

const logWithTime = (debug: Debug.Debugger, ...params: any[]) => {
    debug(`${new Date().toUTCString()}`, ...params)
}

const pickRandomFromArray = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
}