import { Ripple, Zynject, Zynjectable } from '../core';
import { DeviceProvider } from '../providers/device-provider';
import { Express } from 'express';
import { ApiServiceProvider } from './api-service-provider';
import { QueryFilter } from './filters/query-filter';
import { DeviceHub } from '../hubs/device-hub';
import { Device } from '../models/device';

@Zynjectable()
export class DevicesApiServiceProvider extends ApiServiceProvider {



    constructor(private deviceHub: DeviceHub) {
        super();
    }

    register(app: Express, io: {emit: (name: string, data: any)=>void}){

        this.deviceHub.updates$.react(x=>{
            if(x.length){
                io.emit('device-update', x);
            }
        });
        app.get('/devices', async (req, res) => {
            const filter = new QueryFilter(req.query as {[key: string]: any});
            res.json(await this.deviceHub.devices$
                .take(1)
                .react(x => filter.apply(x))
                .promise());
          });

          app.post('/devices/:id', async (req, res) => {
            const value = req.body as Device;
            const thing = await this.deviceHub.updateDevice(value).take(1).promise();
            res.json();
          });

    }
}