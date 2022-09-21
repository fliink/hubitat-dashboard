import { ApiService, ApiFactory, Zynjectable } from '../core';
import { HubitatDevice } from './models/hubitat-device';

export interface Devices {
    getDevices(): Promise<HubitatDevice[]>;
    getDevice(id: number): Promise<HubitatDevice[]>;
}


@Zynjectable()
export class DevicesService {

    private _api: ApiService;
    private _apiHost = 'http://192.168.1.99/apps/api/45';
    private _apiKey = { 'access_token': 'bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1' };
    constructor(private apiFactory: ApiFactory) {
        this._api = this.apiFactory.create(this._apiHost, { requestParameters: this._apiKey });
    }

    getDevices(detailed: boolean = false): Promise<HubitatDevice[]> {
        return this._api.get<HubitatDevice[]>(`devices${detailed ? '/all' : ''}`);
    }
}