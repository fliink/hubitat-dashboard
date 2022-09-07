import { Pipe, PipeTransform } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Pipe({
  name: 'isSwitch'
})
export class IsSwitchPipe implements PipeTransform {

  transform(items: HubitatDevice[], ...args: unknown[]): HubitatDevice[] {
    return items.filter(x=>x.capabilityLookup.Switch && !x.capabilityLookup.Light);
  }

}
