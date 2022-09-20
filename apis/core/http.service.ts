import axios from 'axios';

export class HttpService {
    async get<T>(
        path: string,
        parameters?: { [key: string]: string | number },
        headers?: { [key: string]: string }
    ): Promise<T>{
        return axios.get<T>(`${path}`, {
            params: parameters
        }).then(x=>{
            return x.data
        });
    }
}