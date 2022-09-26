import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'colorAverage'
})
export class ColorAveragePipe implements PipeTransform {

  transform(devices: Device[], ...args: unknown[]): string {
    var rgbLights = devices.filter(x=>x.capabilities.color && x.attributes.power);
    if(!rgbLights.length){ return ''; }
    let gradientStr = 'linear-gradient(90deg';
    let index = 0;
    rgbLights.forEach((device: Device)=>{
      gradientStr += `, rgb(${Number(device.attributes.rgb.r)},${Number(device.attributes.rgb.g)},${Number(device.attributes.rgb.b)}) ${100 * index++ / (rgbLights.length - 1)}%`
    });
    gradientStr += ')';
    return gradientStr;
  }

}
