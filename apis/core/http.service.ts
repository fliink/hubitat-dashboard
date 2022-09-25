import axios from 'axios';
import { Agent } from 'https';
import { Logger, LogLevel } from './logging/logger.service';
import { Zynjectable } from './zynject/zynject';

@Zynjectable()
export class HttpService {

   /**
    * Core http service used for all outgoing web requests
    * @param logger 
    */
    constructor(private logger: Logger) {
        
    }

    async get<T>(
        path: string,
        parameters?: { [key: string]: string | number },
        headers?: { [key: string]: string }
    ): Promise<T>{
        const agent = new Agent({
            rejectUnauthorized: false
        });

        this.logger.log(`GET ${path}`, LogLevel.INFO);
        return axios.get<T>(`${path}`, {
            params: parameters,
            headers,
            httpsAgent: agent
        }).then(x=>{
            return x.data;
        });
    }
}