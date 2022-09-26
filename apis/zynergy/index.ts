import { ConfigurationService, Z } from "../core";
import {HubitatDeviceProvider } from '../hubitat-provider'
import { HueDeviceProvider } from "../hue-provider";
import { ZynergyServer } from "./server";
import { DevicesApiServiceProvider } from "./devices-api-provider";
import { LightsApiServiceProvider } from "./lights-api-provider";
import { RoomsApiServiceProvider } from "./rooms-api-provider";
import { ZynjectContainer } from "../core/zynject/container";

Z.register([
    RoomsApiServiceProvider,
    DevicesApiServiceProvider, 
    LightsApiServiceProvider, 
    HubitatDeviceProvider, 
    HueDeviceProvider
]);
var configService = Z.get(ConfigurationService);

configService.set('hue-api-host', 'https://192.168.1.52/clip/v2');
configService.set('hue-api-key', 'TLPULPfTSrrCdfnb3p9laiPTaafc9OKOFgrPKNvF');
configService.set('hubitat-api-host', 'http://192.168.1.99/apps/api/45');
configService.set('hubitat-api-key', 'bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1');

var server = Z.get(ZynergyServer);

server.start(8080);