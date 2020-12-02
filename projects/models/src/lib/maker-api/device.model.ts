export interface HubitatDevice {
    id: string;
    name: string;
    label: string;
    type?: string;
    model?: string;
    capabilities?: string[];
    capabilityLookup?: DeviceCapabilities,
    attributes?: HubitatDeviceAttributes;
    commands: HubitatDeviceCommand[]
}

export interface DeviceCapabilities {
    Refresh?: boolean;
    Actuator?: boolean;
    ColorTemperature?: boolean;
    ColorMode?: boolean;
    ColorControl?: boolean;
    ChangeLevel?: boolean;
    SwitchLevel?: boolean;
    Light?: boolean;
    Switch?: boolean;
    Telnet?: boolean;
    Initialize?: boolean;
    RelativeHumidityMeasurement?: boolean;
    Configuration?: boolean;
    Battery?: boolean;
    TemperatureMeasurement?: boolean;
    Thermostat?: boolean;
    Sensor?: boolean;
    LightEffects?: boolean;
    Polling?: boolean;
    Valve?: boolean;
    Notification?: boolean;
    PresenceSensor?: boolean;
    HoldableButton?: boolean;
    PushableButton?: boolean;
    DoubleTapableButton?: boolean;
    ReleasableButton?: boolean;
    MotionSensor?: boolean;
    IlluminanceMeasurement?: boolean;
    UltravioletIndex?: boolean;
    AccelerationSensor?: boolean;
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
    humidity?: number,
    illuminance?: number,
    hue?: number,
    level?: number,
    thermostatSetpoint?: number,
    lightEffects?: { [key: number]: string }
    saturation?: number,
    temperature?: number,
    motion?: string,
    switch?: "on" | "off"
}

export interface HubitatDeviceCommand {
    command: string;
}