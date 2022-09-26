import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'thermostat'
})
export class ThermostatPipe implements PipeTransform {

  transform(items: Device[], ...args: unknown[]): Device {
    return items?.find(x=>x.capabilities.thermostat);
  }
}
