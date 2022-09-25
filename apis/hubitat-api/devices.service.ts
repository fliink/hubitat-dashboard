import { ApiService, ApiFactory, Zynjectable, ConfigurationService } from '../core';
import { HubitatDevice } from './models/hubitat-device';

export interface Devices {
    getDevices(): Promise<HubitatDevice[]>;
    getDevice(id: number): Promise<HubitatDevice[]>;
}


@Zynjectable()
export class DevicesService {

    private _api: ApiService;
    constructor(private apiFactory: ApiFactory, configurationService: ConfigurationService) {
        this._api = this.apiFactory.create(configurationService.get('hubitat-api-host'), { requestParameters: { 'access_token': configurationService.get('hubitat-api-key') } });
    }

    getDevices(detailed: boolean = false): Promise<HubitatDevice[]> {
        return this._api.get<HubitatDevice[]>(`devices${detailed ? '/all' : ''}`);
    }
}