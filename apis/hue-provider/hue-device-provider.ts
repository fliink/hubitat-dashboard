import { Device, DeviceAttributes, DeviceCapabilities } from "../models/device";
import { Ripple, Zynjectable } from "../core";
import { DeviceProvider } from "../providers/device-provider";
import { ClipService } from "../hue-api/clip.service";
import { HueDevice, HueDeviceServices, HueLight } from "../hue-api/models";
import { RGBtoXY, XYtoRGB } from "../core/color/color-converter";
import { mergeInto } from "../core/util/merge";
import { Logger, LogLevel } from "../core/logging/logger.service";

@Zynjectable()
export class HueDeviceProvider extends DeviceProvider {

    providerName: string = 'hue';
    private _lights$: Ripple<HueLight[]> = new Ripple<HueLight[]>();
    private _devices$: Ripple<HueDevice[]> = new Ripple<HueDevice[]>();

    constructor(private hueApi: ClipService, logger: Logger) {
        super();
                // TODO: Rework this
        hueApi.updates$.react(updates => {
            const updatedDevices: (HueDevice | HueLight)[] = [];
            const values = this._lights$.value;
            const devices = this._devices$.value;
            if (values) {
                updates.filter(u => u.type === 'light').forEach(update => {
                    logger.log('Received device update', LogLevel.VERBOSE);
                    const targetLight = values.find(x => x.id == update.id);
                    if(targetLight){
                        mergeInto(targetLight, update);
                        updatedDevices.push(targetLight);
                    }else{
                        logger.log('The updated light could not be found', LogLevel.WARNING);
                    }
                });
                this._lights$.drop(values);
                this.updates$.drop(updatedDevices.map(x=> {
                    return this.apiToProvider({
                        light: x as HueLight,
                        device:  devices!.find(d =>x.id == d.services.find(s => s.rtype == 'light')?.rid)!
                    });
                }));
            } else {
                logger.log('Lights had no value, but they should', LogLevel.WARNING);
            }

          
        })
    }


    load(id?: string) {
        this.hueApi.getDevices().then(x => {
            this._devices$.drop(x);
        });
        this.hueApi.getLights().then(x => {
            this._lights$.drop(x);
        });

        Ripple.latest([this._devices$, this._lights$]).react((response) => {
            const devices = response[0] as HueDevice[];
            const lights = response[1] as HueLight[];
            const deviceServices = devices.map(d => {
                const light = lights.find(l => l.id == d.services.find(s => s.rtype == 'light')?.rid);
                return <HueDeviceServices>{
                    device: d,
                    light
                };
            });
            const deviceArray = deviceServices.map(y => this.apiToProvider(y));
            this.devices$.drop(deviceArray);
        });
    }

    update(state: Partial<Device>): any {
        return Ripple.all([this._devices$, this._lights$]).take(1).chain((response) => {
            const devices = response[0] as HueDevice[];
            const lights = response[1] as HueLight[];
            const device = devices.find(x => x.id === state.id);
            const light = lights.find(l => l.id === device?.services.find(s => s.rtype == 'light')?.rid);
            if (light) {
                const body: Partial<HueLight> = {
                    on: {
                        on: state.attributes?.power !== undefined ? state.attributes.power : light.on.on,
                    },
                    color: state.attributes?.rgb !== undefined ? {
                        xy: RGBtoXY(state.attributes?.rgb.r, state.attributes?.rgb.g, state.attributes?.rgb.b)
                    }: light.color,
                    dimming: state.attributes?.level !== undefined ? {
                        brightness: state.attributes?.level
                    }: light.dimming,
                }
                return new Ripple(this.hueApi.setLightState(light.id, body));
            }
            throw `Device with id ${state.id} could not be found.`;
        });
    }

    private apiToProvider(deviceServices: HueDeviceServices): Device {
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

        if (!deviceServices.light?.color) { return { b: 0, r: 0, g: 0, a: 0 } }
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