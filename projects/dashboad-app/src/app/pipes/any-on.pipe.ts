import { Pipe, PipeTransform } from '@angular/core';
import { Device } from 'apis/models/device';

@Pipe({
  name: 'anyOn'
})
export class AnyOnPipe implements PipeTransform {

  transform(items: Device[], ...args: unknown[]): boolean {
    return !!items.find(x=>x.attributes.power);
  }

}
