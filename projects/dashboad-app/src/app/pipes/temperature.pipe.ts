import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: HubitatDevice | string | number, ...args: unknown[]): string {
    if(typeof(value) === 'string' || typeof(value) === 'number' ){
      return `${value}°F`;
    }else{
      return `${value.attributes.temperature}°F`;
    }
  }

}
