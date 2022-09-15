import { Injectable } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { MakerApiService } from '../../services/maker-api.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceCommandService {

  constructor(private makerService: MakerApiService) { }

  emit(device: HubitatDevice, command: any, emitOnSuccess?: {attribute: string, value: string | number} | {attribute: string, value: string | number} []): void{
    this.makerService.sendCommand(device.id, command, emitOnSuccess).subscribe();
  }

  adjustTemperature(device: HubitatDevice, amount: number, mode?: string){
    debugger;
    const targetTemperature = Number(device.attributes.temperature) + amount;
    if(device.attributes.thermostatMode === "heat" || mode == 'heat'){
      this.emit(device, { setHeatingSetpoint: targetTemperature}, [{ attribute: 'temperature', value: targetTemperature }, { attribute: 'heatingSetpoint', value: targetTemperature }]);
    }else if (device.attributes.thermostatMode === "cool"  || mode == 'cool'){
      this.emit(device, { setCoolingSetpoint: targetTemperature}, [{ attribute: 'temperature', value: targetTemperature }, { attribute: 'coolingSetpoint', value: targetTemperature }]);
    }
  }
}
