import { Z } from "../core";
import {HubitatDeviceProvider } from '../hubitat-provider'
import { HueDeviceProvider } from "../hue-provider";
import { ZynergyServer } from "./server";
import { DevicesApiServiceProvider } from "./devices-api-provider";
import { LightsApiServiceProvider } from "./lights-api-provider";

Z.register([
    DevicesApiServiceProvider, 
    LightsApiServiceProvider, 
    HubitatDeviceProvider, 
    HueDeviceProvider
]);

var server = Z.get(ZynergyServer);

server.start(8080);