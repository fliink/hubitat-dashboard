import { Zynjectable } from "../zynject/zynject";

@Zynjectable()
export class Logger {
    log(message: string, level: LogLevel){
        console.log('\x1b[36m%s\x1b[0m',`${new Date()}`, message);
    }
}

export enum LogLevel {
        VERBOSE = 10,
        INFO = 10,
        ERROR = 99
}