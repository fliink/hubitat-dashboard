import { ApiService, ApiFactory, Zynjectable } from '../core';
import { HueResource } from './models/hue-resource';



@Zynjectable()
export class ClipService {

    private _api: ApiService;
    private _apiHost = 'https://192.168.1.52/clip/v2';
    private _apiKey = { 'hue-application-key': 'TLPULPfTSrrCdfnb3p9laiPTaafc9OKOFgrPKNvF' };
    constructor(private apiFactory: ApiFactory) {
        this._api = this.apiFactory.create(this._apiHost, { headers: this._apiKey });
    }

    getDevices(resourceType?: string): Promise<HueResource[]> {
        return this._api.get<HueResource[]>(`resource${resourceType ? `/${resourceType}` : ''}`).then(x=>(<any>x).data);
    }
}