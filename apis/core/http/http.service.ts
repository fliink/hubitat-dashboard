import axios, { AxiosError, CancelToken } from 'axios';
import * as http2 from 'http2';
import { Agent } from 'https';
import { Logger, LogLevel } from '../logging/logger.service';
import { Ripple } from '../reactive';
import { Zynjectable } from '../zynject/zynject';
import { HttpError } from './http-error';

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
    ): Promise<T> {
        const agent = new Agent({
            rejectUnauthorized: false
        });

        this.logger.log(`GET ${path}`, LogLevel.INFO);
        return axios.get<T>(`${path}`, {
            params: parameters,
            headers,
            httpsAgent: agent
        }).then(x => {
            return x.data;
        });
    }

    async put<T, R>(
        path: string,
        body: T,
        parameters?: { [key: string]: string | number },
        headers?: { [key: string]: string }
    ): Promise<R | HttpError> {
        const agent = new Agent({
            rejectUnauthorized: false
        });

        this.logger.log(`PUT ${path}`, LogLevel.INFO);
        return axios.put<R>(`${path}`, body, {
            params: parameters,
            headers,
            httpsAgent: agent,
        }).then(x => {
            return x.data;
        }, (x: AxiosError) => {
            this.logger.log(`PUT ${path} ${x.message}`, LogLevel.ERROR);
            return { message: x.message };
        });
    }
}