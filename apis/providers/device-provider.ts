import { Ripple } from "../core";
import { Device } from "../models/device";

export abstract class DeviceProvider {
    providerName: string;
    devices$: Ripple<Device[]> = new Ripple<Device[]>();
    abstract load(): void;
    abstract load(id: string): void;
}