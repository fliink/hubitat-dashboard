import { Device } from "../models/device";

export abstract class DeviceProvider {
    providerName: string;
    abstract devices(): Promise<Device[]>;
    abstract device(): Promise<Device>;
}