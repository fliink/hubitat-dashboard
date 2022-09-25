import { Device, DeviceAttributes, DeviceCapabilities } from "../models/device";
import { Ripple, Zynjectable } from "../core";
import { DevicesService } from "../hubitat-api/devices.service";
import { HubitatDevice } from "../hubitat-api/models/hubitat-device";
import { DeviceProvider } from "../providers/device-provider";

@Zynjectable()
export class HubitatDeviceProvider extends DeviceProvider {
    providerName: string = 'hubitat';
    devices$: Ripple<Device[]> = new Ripple<Device[]>();

    constructor(private hubitatApi: DevicesService){
        super();
    }
    load(id?: string){
        this.hubitatApi.getDevices(true).then(devices=>{
            const filteredDevices = devices.map(y=>this.apiToProvider(y));
            this.devices$.drop(filteredDevices);
        });
    }

    private apiToProvider(hubitatDevice: HubitatDevice): Device{
        const capabilities = this.getCapabilities(hubitatDevice);
        const attributes = this.getAttributes(hubitatDevice);
        return {
            provider: this.providerName,
            name: hubitatDevice.label || hubitatDevice.name,
            id: hubitatDevice.id,
            capabilities,
            attributes
        };
    }
    private getAttributes(hubitatDevice: HubitatDevice): DeviceAttributes {
        const attributes: Partial<DeviceAttributes> = {
            level: hubitatDevice.attributes.level,
            power: hubitatDevice.attributes.switch == 'on',
            rgb: this.convertToRgb(hubitatDevice),
            temperature: hubitatDevice.attributes.temperature
        };
        return attributes as DeviceAttributes;
    }
    private convertToRgb(hubitatDevice: HubitatDevice): { r: number; g: number; b: number; } {
        return {
            r: 255,
            g: 123,
            b: 127
        };
    }

    private getCapabilities(hubitatDevice: HubitatDevice): DeviceCapabilities {
        const capabilities: Partial<DeviceCapabilities> = {
            color: hubitatDevice.capabilities.indexOf('ColorControl') >= 0,
            switch: hubitatDevice.capabilities.indexOf('Switch') >= 0,
            light: hubitatDevice.capabilities.indexOf('Light') >= 0,
            level: hubitatDevice.capabilities.indexOf('SwitchLevel') >= 0,
            sensor: hubitatDevice.capabilities.indexOf('Sensor') >= 0,
            thermostat: hubitatDevice.capabilities.indexOf('Thermostat') >= 0,
        };

        return capabilities as DeviceCapabilities;
    }

}