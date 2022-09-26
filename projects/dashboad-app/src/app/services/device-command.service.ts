import { Injectable } from '@angular/core';
import { Device } from 'apis/models/device';
import { MakerApiService } from '../../services/maker-api.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceCommandService {

  constructor(private makerService: MakerApiService) { }

  emit(device: Device, command: any, emitOnSuccess?: {attribute: string, value: string | number} | {attribute: string, value: string | number} []): void{
    this.makerService.sendCommand(device.id, command, emitOnSuccess).subscribe();
  }

  adjustTemperature(device: Device, amount: number, mode?: string){
    const targetTemperature = Number(device.attributes.temperature) + amount;
    //  TODO
    // if(device.attributes.thermostatMode === "heat" || mode == 'heat'){
    //   this.emit(device, { setHeatingSetpoint: targetTemperature}, [{ attribute: 'temperature', value: targetTemperature }, { attribute: 'heatingSetpoint', value: targetTemperature }]);
    // }else if (device.attributes.thermostatMode === "cool"  || mode == 'cool'){
    //   this.emit(device, { setCoolingSetpoint: targetTemperature}, [{ attribute: 'temperature', value: targetTemperature }, { attribute: 'coolingSetpoint', value: targetTemperature }]);
    // }
  }
}
