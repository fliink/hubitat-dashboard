
export interface HubitatDeviceCapabilities {
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