import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'isLight'
})
export class IsLightPipe implements PipeTransform {

  transform(items: HubitatDevice[], ...args: unknown[]): HubitatDevice[] {
    return items.filter(x=>x.capabilityLookup.Light);
  }

}
