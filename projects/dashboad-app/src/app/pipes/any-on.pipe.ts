import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'anyOn'
})
export class AnyOnPipe implements PipeTransform {

  transform(items: HubitatDevice[], ...args: unknown[]): boolean {
    return !!items.find(x=>x.attributes.switch == 'on');
  }

}
