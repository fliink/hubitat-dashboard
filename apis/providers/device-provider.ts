import { Ripple } from "apis/core";
import { Device } from "../models/device";

export abstract class DeviceProvider {
    providerName: string;
    devices$: Ripple<Device[]> = new Ripple<Device[]>();
    abstract devices(): Promise<Device[]>;
    abstract device(): Promise<Device>;
}