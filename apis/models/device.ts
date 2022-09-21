export interface Device {
    provider: string;
    name: string;
    id: string;
    capabilities: DeviceCapabilities;
    attributes: DeviceAttributes
}

export interface DeviceCapabilities {
    light: boolean;
    switch: boolean;
    color: boolean;
    sensor: boolean;
    thermostat: boolean;
    level: boolean;
}

export interface DeviceAttributes {
    level?: number;
    rgb?: {
        r: number,
        g: number,
        b: number
    },
    power?: boolean,
    temperature?: number
}