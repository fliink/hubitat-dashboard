import { Device } from "../models/device";

export interface DeviceProvider {
    devices(): Promise<Device[]>;
    device(): Promise<Device>;
}