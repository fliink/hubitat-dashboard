import { Ripple, Zynject, Zynjectable } from "../core";
import { Logger } from "../core/logging/logger.service";
import { Device } from "../models/device";
import { DeviceProvider } from "../providers/device-provider";

@Zynjectable()
export class DeviceHub {
    devices$: Ripple<Device[]>;
    updates$: Ripple<Device[]>;

    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[]) {
        this.devices$ =
            Ripple.latest(deviceProviders.map(x => x.devices$))
                .react(x => {
                    const reduced = x.reduce((a, b) => {
                        a.push(...b);
                        return a;
                    }, <Device[]>[]);
                    return reduced;
                });
        deviceProviders.forEach(x => x.load());

        this.updates$ =
            Ripple.latest(deviceProviders.map(x => x.updates$))
                .react(x => {
                    const reduced = x.reduce((a, b) => {
                        a.push(...b);
                        return a;
                    }, <Device[]>[]);
                    return reduced;
                });
    }

    updateDevice(device: Partial<Device>) {
        return this.devices$.take(1).chain(x => {
            const foundDevice = x.find(y => y.id === device.id);
            if (!foundDevice) {
                throw `Device with id ${device.id} could not be found.`;
            }
            const provider = this.deviceProviders.find(p => p.providerName === foundDevice.provider);
            if (!provider) {
                throw `Provider of type ${foundDevice.provider} could not be found.`;
            }
            return provider.update(device);
        });
    }
}