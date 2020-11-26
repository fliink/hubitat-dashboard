export interface HubitatDevice {
    id: string;
    name: string;
    label: string;
    type?: string;
    model?: string;
    capabilities?: string[];
    attributes?: HubitatDeviceAttributes;
    commands: HubitatDeviceCommand[]
}

export interface HubitatDeviceAttributes {
    RGB?: any;
    dataType?: string,
    values?: string[],
    color?: null,
    colorMode?: string,
    colorName?: string,
    colorTemperature?: number,
    effectName?: string,
    hue?: number,
    level?: number,
    lightEffects?: { [key: number]: string }
    saturation?: number,
    switch?: "on" | "off"
}

export interface HubitatDeviceCommand {
    command: string;
}