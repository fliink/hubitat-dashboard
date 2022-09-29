import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(device: Device, ...args: unknown[]): string {
    if(!device.capabilities.color){
      throw new Error(`This device (${device.id}) does not support setting color`);
    }
    if(!device.attributes.power){
      return 'rgb(0,0,0)';
    }

    return `rgb(${Number(device.attributes.rgb.r)},${Number(device.attributes.rgb.g)},${Number(device.attributes.rgb.b)})`;
  }

}
