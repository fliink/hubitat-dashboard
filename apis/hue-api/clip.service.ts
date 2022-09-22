import { ApiService, ApiFactory, Zynjectable } from '../core';
import { HueDevice } from './models/hue-device';
import { HueLight } from './models/hue-light';



@Zynjectable()
export class ClipService {

    private _api: ApiService;
    private _apiHost = 'https://192.168.1.52/clip/v2';
    private _apiKey = { 'hue-application-key': 'TLPULPfTSrrCdfnb3p9laiPTaafc9OKOFgrPKNvF' };
    constructor(private apiFactory: ApiFactory) {
        this._api = this.apiFactory.create(this._apiHost, { headers: this._apiKey });
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