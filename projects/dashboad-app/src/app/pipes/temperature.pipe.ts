import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: Device[] | Device | string | number, ...args: unknown[]): string {

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
