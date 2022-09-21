import { HubitatDeviceAttributes } from "./hubitat-device-attributes";
import { HubitatDeviceCapabilities } from "./hubitat-device-capabilities";
import { HubitatDeviceCommand } from "./hubitat-device-command";

export interface HubitatDevice {
    id: string;
    name: string;
    label: string;
    type?: string;
    model?: string;
    capabilities: string[];
    capabilityLookup: HubitatDeviceCapabilities,
    attributes: HubitatDeviceAttributes;
    commands: HubitatDeviceCommand[]
}