import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'attribute'
})
export class AttributePipe implements PipeTransform {

  transform(devices: Device[], ...args: any[]): Device[] {
    const attribute:string = args[0];
    const value:string = args[1];

    return devices.filter(x=>x.attributes[attribute] === value);
  }

}
