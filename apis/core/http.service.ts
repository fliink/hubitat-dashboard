import axios from 'axios';
import { Agent } from 'https';

export class HttpService {
    async get<T>(
        path: string,
        parameters?: { [key: string]: string | number },
        headers?: { [key: string]: string }
    ): Promise<T>{
        const agent = new Agent({
            rejectUnauthorized: false
        })
        return axios.get<T>(`${path}`, {
            params: parameters,
            headers,
            httpsAgent: agent
        }).then(x=>{
            return x.data
        });
    }
}