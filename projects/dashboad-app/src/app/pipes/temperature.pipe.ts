import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: HubitatDevice[] | HubitatDevice | string | number, ...args: unknown[]): string {

    if(!value){ return ''; }
    if(typeof(value) === 'string' || typeof(value) === 'number' ){
      return `${value}°F`;
    }else if(Array.isArray(value)){
      const tempSensor = value.find(x=>x.attributes.temperature);
      if(tempSensor){
        return `${tempSensor.attributes.temperature}°F`;
      }
      return '';
    }else{
      return `${value.attributes.temperature}°F`;
    }
  }

}
