import { Device, DeviceAttributes, DeviceCapabilities } from "../models/device";
import { Zynjectable } from "../core";
import { DevicesService } from "../hubitat-api/devices.service";
import { HubitatDevice } from "../hubitat-api/models/hubitat-device";
import { DeviceProvider } from "../providers/device-provider";
import { ClipService } from "../hue-api/clip.service";
import { HueResource } from "../hue-api/models/hue-resource";

@Zynjectable()
export class HueDeviceProvider extends DeviceProvider {
    providerName: string = 'hue';
    constructor(private hueApi: ClipService){
        super();
    }
    devices(): Promise<Device[]> {
        return this.hueApi.getDevices('light').then(x=>{
            return x.map(y=>this.apiToProvider(y));
        });
    }

    device(): Promise<Device>  {
        throw new Error("Method not implemented.");
    }

    private apiToProvider(hueDevice: HueResource): Device{
        const capabilities = this.getCapabilities(hueDevice);
        const attributes = this.getAttributes(hueDevice);
        return {
            provider: this.providerName,
            name: hueDevice.metadata?.name,
            id: hueDevice.id,
            capabilities,
            attributes
        };
    }

    private getAttributes(hueDevice: HueResource): DeviceAttributes {
        const attributes: Partial<DeviceAttributes> = {
            level: hueDevice.dimming.brightness,
            power: hueDevice.on.on,
            rgb: this.convertToRgb(hueDevice)
        };
        return attributes as DeviceAttributes;
    }
    private convertToRgb(hueDevice: HueResource): { r: number; g: number; b: number; } {
        return {
            r: 255,
            g: 123,
            b: 127
        };
    }

    private getCapabilities(hueDevice: HueResource): DeviceCapabilities {
        const capabilities: Partial<DeviceCapabilities> = {
            color: !!hueDevice.color,
            switch: hueDevice.on !== undefined,
            light: hueDevice.type == 'light',
            level: hueDevice.dimming !== undefined,
            sensor: false,
            thermostat: false
        };

        return capabilities as DeviceCapabilities;
    }

}