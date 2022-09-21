import { HttpService } from './http.service';
import { Zynjectable } from './zynject/zynject';
@Zynjectable()
export class ApiService {
    private _host: string;
    private _options?: ApiServiceOptions;
    get<T>(
        path: string,
        parameters?: { [key: string]: string | number },
        headers?: { [key: string]: string }
    ): Promise<T>{
        return this.httpService.get(`${this._host}/${path}`, {
            ...this._options?.requestParameters,
            ...parameters
        },
        {
            ...this._options?.headers,
            ...headers
        });
    }

    constructor(host: string, private httpService: HttpService, options?: ApiServiceOptions) {
        this._host = host;
        this._options = options;
    }
}

export interface ApiServiceOptions {
    requestParameters?: {[key: string] : string};
    headers?: {[key: string] : string};
}