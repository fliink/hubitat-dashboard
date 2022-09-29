import { Ripple, Zynject, Zynjectable } from "../core";
import { Device } from "../models/device";
import { DeviceProvider } from "../providers/device-provider";

@Zynjectable()
export class DeviceHub {
    devices$: Ripple<Device[]>;

    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[]) {

    }
}