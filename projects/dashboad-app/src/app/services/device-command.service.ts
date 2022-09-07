import { Injectable } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { MakerApiService } from '../../services/maker-api.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceCommandService {

  constructor(private makerService: MakerApiService) { }

  emit(device: HubitatDevice, command: any, emitOnSuccess?: {attribute: string, value: string}): void{
    this.makerService.sendCommand(device.id, command, emitOnSuccess).subscribe();
  }
}
