import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'isLight'
})
export class IsLightPipe implements PipeTransform {

  transform(items: Device[], ...args: unknown[]): Device[] {
    return items.filter(x=>x.capabilities.light);
  }

}
