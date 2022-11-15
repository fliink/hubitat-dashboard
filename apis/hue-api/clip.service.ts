import { ApiService, ApiFactory, Zynjectable, ConfigurationService, Ripple } from '../core';
import { HueDevice } from './models/hue-device';
import { HueDeviceUpdate } from './models/hue-device-update';
import { HueLight } from './models/hue-light';
import { Cancel } from 'axios';
const EventSource = require('eventsource');


@Zynjectable()
export class ClipService {

    private _api: ApiService;
    updates$: Ripple<Partial<HueDevice | HueLight>[]> = new Ripple();
    constructor(private apiFactory: ApiFactory, configurationService: ConfigurationService) {
        this._api = this.apiFactory.create(configurationService.get('hue-api-host') + '/clip/v2', { headers: { 'hue-application-key': configurationService.get('hue-api-key') } });
        const source = new EventSource(configurationService.get('hue-api-host') + '/eventstream/clip/v2', { headers: { 'hue-application-key': configurationService.get('hue-api-key') } });
        source.onmessage = (message: MessageEvent) => {
            const updates = JSON.parse(message.data) as HueDeviceUpdate[];
            const allUpdates = updates.reduce((a, b)=>{
                a.push(...b.data);
                return a;
            }, <Partial<HueDevice | HueLight>[]>[]);
            this.updates$.drop(allUpdates);
        }

        source.onerror = function (err: any) {
            if (err) {
                console.log(err);
            }
          };
    }

    async getDevices(resourceType?: string): Promise<HueDevice[]> {
        return this.getResources<HueDevice[]>('device');
    }

    async getLights(resourceType?: string): Promise<HueLight[]> {
        return this.getResources<HueLight[]>('light');
    }

    async setLightState(id: string, state: Partial<HueLight>): Promise<HueLight> {
        const p = this._api.put<Partial<HueLight>, any>(`resource/light/${id}`, state);
        return p;
    }

    private getResources<T>(resourceType?: string): Promise<T> {
        return this._api.get<T>(`resource${resourceType ? `/${resourceType}` : ''}`).then(x => (<any>x).data);
    }
}