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
            this.deviceProviders.forEach(x=>x.load());
            
            var ripple = Ripple.joinAll(this.deviceProviders.map(x=>x.devices$))
                .react(x=>filter.apply(x))
                .take(1);

            res.json(await ripple.promise());
          });
    }
}