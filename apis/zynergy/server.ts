import { Logger, LogLevel } from '../core/logging/logger.service';
import * as bodyParser from 'body-parser';
import express from 'express';
import { Express } from 'express';
import { Zynject, Zynjectable } from "../core";
import { ApiServiceProvider } from "./api-service-provider";
import * as io from 'socket.io';

@Zynjectable()
export class ZynergyServer {
    app: Express;
    ioServer: io.Server;
    constructor(@Zynject(ApiServiceProvider) private apiProviders: ApiServiceProvider[], private logger: Logger) {
    }

    start(port: number) {
        this.app = express();
        this.app.use(this.cors);
        this.app.use(bodyParser.json());
        this.app.use((a,b,c)=>this.log(a,b,c));


        const server = this.app.listen(port);
        this.ioServer = new io.Server(server, {
            allowEIO3: true,
            cors: {
              origin: ["http://192.168.1.55", "http://localhost:4200", "http://home.local/"],
              methods: ["GET", "POST"],
              credentials: true
            }
          });

          this.apiProviders.forEach(p => {
            p.register(this.app, this.ioServer);
        });
    }

    private emit(type: string, data: any){
        this.ioServer.emit('message', data);
    }

    private cors(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    }

    private log(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.logger.log(`API ${req.method} ${req.url}`, LogLevel.VERBOSE);
        next();
    }




}


