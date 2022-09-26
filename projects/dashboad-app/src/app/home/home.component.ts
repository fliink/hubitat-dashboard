import { Component, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakerApiService } from '../../services/maker-api.service';
import { RoomService } from '../../services/room.service';
import { DeviceCommandService } from '../services/device-command.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  devices$: Observable<Device[]>;
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

  incrementTemperature(device: Device, increment: number, mode: string): void{
    this.deviceCommandService.adjustTemperature(device, increment, mode);
  }

}
