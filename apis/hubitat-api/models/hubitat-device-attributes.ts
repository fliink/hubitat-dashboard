
export interface HubitatDeviceAttributes {
    RGB?: any;
    dataType?: string,
    values?: string[],
    color?: null,
    colorMode?: string,
    colorName?: string,
    colorTemperature?: number,
    effectName?: string,
    humidity?: number,
    illuminance?: number,
    hue?: number,
    level?: number,
    thermostatSetpoint?: number,
    coolingSetpoint?: number,
    heatingSetpoint?: number,
    lightEffects?: { [key: number]: string }
    saturation?: number,
    temperature?: number,
    motion?: string,
    switch?: "on" | "off",
    thermostatMode?: "auto" | "cool" | "heat" | "off"
}
