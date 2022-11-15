import { Zynjectable } from "../zynject/zynject";

@Zynjectable()


export class Logger {
    
    private errorColor = "\x1b[31m";
    private infoColor = "\x1b[36m";
    private verboseColor = "\x1b[97m";
    private warningcolor = "\x1b[33m";
    private endColor = "\x1b[0m";

    private colorLookup: {[key: number]: string} = {
        10: this.infoColor,
        15: this.verboseColor,
        98: this.warningcolor,
        99: this.errorColor,
    }

    log(message: string, level: LogLevel){
        console.log(`${this.colorLookup[level]}%s${this.endColor}`,`${new Date()}`, message);
    }
}

export enum LogLevel {
        INFO = 10,
        VERBOSE = 15,
        WARNING = 98,
        ERROR = 99
}