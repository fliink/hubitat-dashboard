import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'isSensor'
})
export class IsSensorPipe implements PipeTransform {

  transform(items: Device[], ...args: unknown[]): Device[] {
    return items.filter(x=>x.capabilities.sensor);
  }

}
