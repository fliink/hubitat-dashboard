import { Device } from "../models/device";
import { Zynjectable } from "../core";
import { DevicesService } from "../hubitat-api/devices.service";
import { HubitatDevice } from "../hubitat-api/models/hubitat-device";
import { DeviceProvider } from "../providers/device-provider";

@Zynjectable()
export class HubitatDeviceProvider implements DeviceProvider {
    constructor(private hubitatApi: DevicesService){

    }
    devices(): Promise<Device[]> {
        return this.hubitatApi.getDevices(true).then(x=>{
            return x.map(this.apiToProvider);
        });
    }

    device(): Promise<Device>  {
        throw new Error("Method not implemented.");
    }

    private apiToProvider(hubitatDevice: HubitatDevice): Device{
        return {
            name: hubitatDevice.name
        };
    }

}