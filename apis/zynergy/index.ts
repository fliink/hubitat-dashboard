import { Z } from "../core";
import { TestZynject} from './test-zynject'
import {HubitatDeviceProvider } from '../hubitat-provider'
import { HueDeviceProvider } from "../hue-provider";
import { ZynergyServer } from "./server";

Z.register([HubitatDeviceProvider, HueDeviceProvider]);
var server = Z.get(ZynergyServer);

server.start(8080);