import { Logger, LogLevel } from '../core/logging/logger.service';
import * as bodyParser from 'body-parser';
import express from 'express';
import { Express } from 'express';
import { Zynject, Zynjectable } from "../core";
import { ApiServiceProvider } from "./api-service-provider";

@Zynjectable()
export class ZynergyServer {
    app: Express;
    
    constructor(@Zynject(ApiServiceProvider) private apiProviders: ApiServiceProvider[], private logger: Logger) {
    }

    start(port: number){
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use((req, res, next)=>{
            this.logger.log(`API ${req.method} ${req.url}`, LogLevel.VERBOSE); 
            next();
        });
        this.apiProviders.forEach(p=>{
            p.register(this.app);
        })

        this.app.listen(port);
    }




}


