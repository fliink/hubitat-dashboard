import { Zynjectable } from "./zynject/zynject";

//  TODO: get a proper configuration object
@Zynjectable()
export class ConfigurationService {
    host: string = '';

    /**
     *
     */
    constructor() {
        
    }
}