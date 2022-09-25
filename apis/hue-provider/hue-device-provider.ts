import { Device, DeviceAttributes, DeviceCapabilities } from "../models/device";
import { Ripple, Zynjectable } from "../core";
import { DeviceProvider } from "../providers/device-provider";
import { ClipService } from "../hue-api/clip.service";
import { HueDeviceServices } from "../hue-api/models";
import { XYtoRGB } from "../core/color/color-converter";

@Zynjectable()
export class HueDeviceProvider extends DeviceProvider {
    providerName: string = 'hue';
    devices$: Ripple<Device[]> = new Ripple<Device[]>();

    constructor(private hueApi: ClipService){
        super();
    }


    load(id?: string){
        Promise.all([this.hueApi.getDevices(), this.hueApi.getLights()]).then(([devices, lights])=>{
            const deviceServices = devices.map(d=>{
                const light = lights.find(l=>l.id == d.services.find(s=>s.rtype == 'light')?.rid);
                return <HueDeviceServices>{
                    device: d,
                    light
                };
            });
            const deviceArray = deviceServices.map(y=>this.apiToProvider(y));
            this.devices$.drop(deviceArray);
        });
    }

    private apiToProvider(deviceServices: HueDeviceServices): Device{
        const capabilities = this.getCapabilities(deviceServices);
        const attributes = this.getAttributes(deviceServices);
        return {
            provider: this.providerName,
            name: deviceServices.device.metadata?.name,
            id: deviceServices.device.id,
            capabilities,
            attributes
        };
    }

    private getAttributes(deviceServices: HueDeviceServices): DeviceAttributes {
        const attributes: Partial<DeviceAttributes> = {
            level: deviceServices.light?.dimming.brightness,
            power: deviceServices.light?.on.on,
            rgb: this.convertToRgb(deviceServices)
        };
        return attributes as DeviceAttributes;
    }
    private convertToRgb(deviceServices: HueDeviceServices): { r: number; g: number; b: number; a?: number } {

        if(!deviceServices.light?.color){ return { b: 0, r: 0, g: 0, a: 0}}
        return XYtoRGB(deviceServices.light.color?.xy, 1, deviceServices.light?.product_data?.model_id, deviceServices.light.color.gamut);
    }

    private getCapabilities(deviceServices: HueDeviceServices): DeviceCapabilities {
        const capabilities: Partial<DeviceCapabilities> = {
            color: !!deviceServices.light?.color,
            switch: deviceServices.light?.on !== undefined,
            light: !!deviceServices.light,
            level: deviceServices.light?.dimming !== undefined,
            sensor: false,
            thermostat: false
        };

        return capabilities as DeviceCapabilities;
    }

}