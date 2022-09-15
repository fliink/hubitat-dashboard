import { Pipe, PipeTransform } from '@angular/core';
import * as internal from 'events';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'colorAverage'
})
export class ColorAveragePipe implements PipeTransform {

  transform(devices: HubitatDevice[], ...args: unknown[]): string {
    var rgbLights = devices.filter(x=>x.capabilityLookup.ColorControl && x.attributes.switch === 'on');
    if(!rgbLights.length){ return ''; }
    const averages = rgbLights.reduce((val: any, device: HubitatDevice)=>{
      return {
        hue: val.hue + Number(device.attributes.hue),
        saturation: val.saturation +Number(device.attributes.saturation),
        level: val.level + Number(device.attributes.level),
        colorTemperature: val.colorTemperature + Number(device.attributes.colorTemperature),
      };
    }, {hue: 0, saturation: 0, level: 0, colorTemperature: 0});

    averages.hue = averages.hue / rgbLights.length;
    averages.saturation = averages.saturation / rgbLights.length;
    averages.level = averages.level / rgbLights.length;
    averages.colorTemperature = averages.colorTemperature / rgbLights.length;

    const cssValue = {
      hue: (averages.hue / 100) * 360,
      saturation: averages.saturation,
      lightness: averages.level / 2
    };

    return `hsl(${cssValue.hue},${cssValue.saturation}%,${cssValue.lightness}%)`;
  }

}
