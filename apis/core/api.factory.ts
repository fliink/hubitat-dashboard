import { ApiService, ApiServiceOptions } from "./api.service";
import { HttpService } from "./http.service";
import { Zynjectable } from "./zynject/zynject";

@Zynjectable()
export class ApiFactory {
    constructor(private httpService: HttpService){

    }
    create(host: string, options?: ApiServiceOptions): ApiService {
        return new ApiService(host, this.httpService, options);
    }
}