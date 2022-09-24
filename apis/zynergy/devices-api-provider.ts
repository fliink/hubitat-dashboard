import { Ripple, Zynject, Zynjectable } from '../core';
import { DeviceProvider } from '../providers/device-provider';
import { Express } from 'express';
import { ApiServiceProvider } from './api-service-provider';
import { QueryFilter } from './filters/query-filter';

@Zynjectable()
export class DevicesApiServiceProvider extends ApiServiceProvider {

    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[]) {
        super();
    }

    register(app: Express){
        app.get('/devices', async (req, res) => {
            const filter = new QueryFilter(req.query as {[key: string]: any});
            this.deviceProviders.map(x=>x.devices());
            Ripple.all(this.deviceProviders.map(x=>x.devices$)).react(x=>{
            });
            return Promise.all(this.deviceProviders.map(x=>x.devices())).then(x=>{
                const devices = x.reduce((a, b)=>{
                    return a.concat(b);
                }, []);

                const filteredDevices = filter.filter(devices);
                
                return res.json(filteredDevices);
            })
          });
    }
}