import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'thermostat'
})
export class ThermostatPipe implements PipeTransform {

  transform(items: HubitatDevice[], ...args: unknown[]): HubitatDevice {
    return items?.find(x=>x.capabilityLookup.Thermostat);
  }
}
