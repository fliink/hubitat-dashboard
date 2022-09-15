import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'attribute'
})
export class AttributePipe implements PipeTransform {

  transform(devices: HubitatDevice[], ...args: string[]): HubitatDevice[] {
    const attribute:string = args[0];
    const value:string = args[1];

    return devices.filter(x=>x.attributes[attribute] === value);
  }

}
