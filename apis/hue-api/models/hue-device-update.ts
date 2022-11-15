import { HueDevice } from "./hue-device";
import { HueLight } from "./hue-light";

export interface HueDeviceUpdate {
    creationtime: Date;
    data: Partial<HueDevice | HueLight>[];
    id: string;
    type: 'update';
}