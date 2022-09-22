import { HueDevice } from "./hue-device";
import { HueLight } from "./hue-light";

export interface HueDeviceServices {
    device: HueDevice,
    light: HueLight,
}