import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'isSwitch'
})
export class IsSwitchPipe implements PipeTransform {

  transform(items: Device[], ...args: unknown[]): Device[] {
    return items.filter(x=>x.capabilities.switch && !x.capabilities.light);
  }

}
