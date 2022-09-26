import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';

@Component({
  selector: 'app-thermostat-tile',
  templateUrl: './thermostat-tile.component.html',
  styleUrls: ['./thermostat-tile.component.scss']
})
export class ThermostatTileComponent implements OnInit {

  @Input() device: Device;

  constructor(private hubitatService: MakerApiService) { 
  }

  ngOnInit(): void {
  }

  adjustTemperature(amount){
    //  TODO
    // const targetTemperature = Number(this.device.attributes.thermostatSetpoint) + amount;
    // if(this.device.attributes.thermostatMode === "heat"){
    //   this.hubitatService.sendCommand(this.device.id, { setHeatingSetpoint: targetTemperature}).subscribe();
    // }else if (this.device.attributes.thermostatMode === "cool"){
    //   this.hubitatService.sendCommand(this.device.id, { setCoolingSetpoint: targetTemperature}).subscribe();
    // }
  }

}
