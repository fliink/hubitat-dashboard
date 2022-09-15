import { Component, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakerApiService } from '../../services/maker-api.service';
import { ThermostatPipe } from '../pipes/thermostat.pipe';
import { DeviceCommandService } from '../services/device-command.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  devices$: Observable<HubitatDevice[]>;

  constructor(private makerApiSvc: MakerApiService, private deviceCommandService: DeviceCommandService) { 
    this.makerApiSvc.loadDevices();
  }

  ngOnInit(): void {
    this.devices$ = this.makerApiSvc.devices$;
  }

  incrementTemperature(device: HubitatDevice, increment: number, mode: string): void{
    this.deviceCommandService.adjustTemperature(device, increment, mode);
  }

}
