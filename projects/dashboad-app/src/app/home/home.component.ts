import { Component, OnInit } from '@angular/core';
import { Room } from 'projects/models/src/lib/dashboard-api/room';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakerApiService } from '../../services/maker-api.service';
import { RoomService } from '../../services/room.service';
import { ThermostatPipe } from '../pipes/thermostat.pipe';
import { DeviceCommandService } from '../services/device-command.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  devices$: Observable<HubitatDevice[]>;
  rooms$: Observable<any[]>;

  constructor(private makerApiSvc: MakerApiService, private deviceCommandService: DeviceCommandService, private roomService: RoomService) { 
    this.makerApiSvc.loadDevices();
    this.roomService.load();
  }

  ngOnInit(): void {
    this.devices$ = this.makerApiSvc.devices$;
    this.rooms$ = combineLatest([this.makerApiSvc.deviceMap$, this.roomService.rooms$]).pipe(map(([devices, rooms])=>{
      return rooms.map(x=>({
        id: x.id,
        name: x.name,
        devices: x.devices.map(x=>devices[x])
      }));
    }));
  }

  incrementTemperature(device: HubitatDevice, increment: number, mode: string): void{
    this.deviceCommandService.adjustTemperature(device, increment, mode);
  }

}
