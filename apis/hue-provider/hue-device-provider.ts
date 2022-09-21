import { Device, DeviceAttributes, DeviceCapabilities } from "../models/device";
import { Zynjectable } from "../core";
import { DevicesService } from "../hubitat-api/devices.service";
import { HubitatDevice } from "../hubitat-api/models/hubitat-device";
import { DeviceProvider } from "../providers/device-provider";
import { ClipService } from "../hue-api/clip.service";
import { HueResource } from "../hue-api/models/hue-resource";
import { XYtoRGB } from "../core/color/color-converter";

@Zynjectable()
export class HueDeviceProvider extends DeviceProvider {
    providerName: string = 'hue';
    constructor(private hueApi: ClipService){
        super();
    }
    devices(): Promise<Device[]> {
        return this.hueApi.getDevices().then(x=>{
            const devices = x.filter(y=>y.type == 'device');
            const lookup = x.reduce((a,b)=>{
                a[b.id] = b;
                return a;
            }, <{[key: string]: HueResource}>{});
            return devices.map(y=>this.apiToProvider(y, lookup));
        });
    }

    device(): Promise<Device>  {
        throw new Error("Method not implemented.");
    }

    private apiToProvider(hueDevice: HueResource, lookup: {[key: string]: HueResource}): Device{
        const capabilities = this.getCapabilities(hueDevice);
        const lightRid = hueDevice.services?.find(x=>x.rtype == 'light')?.rid;
        const light = lightRid ? lookup[lightRid] : undefined;
        const attributes = this.getAttributes(hueDevice, light);
        return {
            provider: this.providerName,
            name: hueDevice.metadata?.name,
            id: hueDevice.id,
            capabilities,
            attributes
        };
    }

    private getAttributes(hueDevice: HueResource, lightService?: HueResource): DeviceAttributes {
        const attributes: Partial<DeviceAttributes> = {
            level: lightService?.dimming.brightness,
            power: lightService?.on.on,
            rgb: this.convertToRgb(hueDevice, lightService)
        };
        return attributes as DeviceAttributes;
    }
    private convertToRgb(hueDevice: HueResource, lightService?: HueResource): { r: number; g: number; b: number; a?: number } {

        if(!lightService?.color){ return { b: 0, r: 0, g: 0, a: 0}}
        return XYtoRGB(lightService.color?.xy, lightService?.product_data?.model_id, lightService.color.gamut);
    }

    private getCapabilities(hueDevice: HueResource, lightService?: HueResource): DeviceCapabilities {
        const capabilities: Partial<DeviceCapabilities> = {
            color: !!lightService?.color,
            switch: lightService?.on !== undefined,
            light: !!lightService,
            level: lightService?.dimming !== undefined,
            sensor: false,
            thermostat: false
        };

        return capabilities as DeviceCapabilities;
    }

}