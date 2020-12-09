import { Component, Input, OnInit } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Component({
  selector: 'app-thermostat-tile',
  templateUrl: './thermostat-tile.component.html',
  styleUrls: ['./thermostat-tile.component.scss']
})
export class ThermostatTileComponent implements OnInit {

  @Input() device: HubitatDevice;

  constructor(private hubitatService: MakerApiService) { 
  }

  ngOnInit(): void {
    console.log('thermostat', this.device);
  }

  adjustTemperature(amount){
    const targetTemperature = Number(this.device.attributes.thermostatSetpoint) + amount;
    if(this.device.attributes.thermostatMode === "heat"){
      this.hubitatService.sendCommand(this.device.id, { setHeatingSetpoint: targetTemperature}).subscribe();
    }else if (this.device.attributes.thermostatMode === "cool"){
      this.hubitatService.sendCommand(this.device.id, { setCoolingSetpoint: targetTemperature}).subscribe();
    }
  }

}
