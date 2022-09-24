import { Zynject, Zynjectable } from '../core';
import { DeviceProvider } from '../providers/device-provider';
import { Express } from 'express';
import { ApiServiceProvider } from './api-service-provider';
import { QueryFilter } from './filters/query-filter';
import { SetLightState } from './models/light-state';

@Zynjectable()
export class LightsApiServiceProvider extends ApiServiceProvider {

    private _endpoint: string = '/lights';

    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[]) {
        super();
    }

    register(app: Express) {
        app.get(`${this._endpoint}`, async (req, res) => {
            const filter = new QueryFilter(req.query as { [key: string]: any });

            return Promise.all(this.deviceProviders.map(x => x.devices())).then(x => {
                const devices = x.reduce((a, b) => {
                    return a.concat(b);
                }, []);

                const filteredDevices = filter.filter(devices);

                return res.json(filteredDevices);
            })
        });

        app.post(`${this._endpoint}/:id`, async (req, res) => {
            const state = req.body as SetLightState;
            console.log(state);
            res.json({ state });
        });
    }
}