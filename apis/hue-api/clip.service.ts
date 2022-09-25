import { ApiService, ApiFactory, Zynjectable, ConfigurationService } from '../core';
import { HueDevice } from './models/hue-device';
import { HueLight } from './models/hue-light';



@Zynjectable()
export class ClipService {

    private _api: ApiService;
    constructor(private apiFactory: ApiFactory, configurationService: ConfigurationService) {
        this._api = this.apiFactory.create(configurationService.get('hue-api-host'), { headers: { 'hue-application-key': configurationService.get('hue-api-key') } });
    }

    getDevices(resourceType?: string): Promise<HueDevice[]> {
        return this.getResources<HueDevice[]>('device');
    }

    getLights(resourceType?: string): Promise<HueLight[]> {
        return this.getResources<HueLight[]>('light');
    }

    private getResources<T>(resourceType?: string): Promise<T>{
        return this._api.get<T>(`resource${resourceType ? `/${resourceType}` : ''}`).then(x=>(<any>x).data);
    }
}