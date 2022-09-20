import { Zynject } from "../core";

import { HubitatDeviceProvider } from '../hubitat-provider/hubitat-device-provider'

var service = Zynject(HubitatDeviceProvider);

service.devices().then(x=>{
    console.log(x);
});


