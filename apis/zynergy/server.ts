import { Zynject, Zynjectable } from "../core";
import express from 'express';
import { Express } from 'express';
import { ApiServiceProvider } from "./api-service-provider";
import { ZynjectContainer } from "../core/zynject/container";

@Zynjectable()
export class ZynergyServer {
    app: Express;
    
    constructor(@Zynject(ApiServiceProvider) private apiProviders: ApiServiceProvider[]) {
        console.log('Api Providers', apiProviders);
    }

    start(port: number){
        this.app = express();
        this.apiProviders.forEach(p=>{
            p.register(this.app);
        })

        this.app.listen(port);
    }



}


