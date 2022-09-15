import { Component, OnInit } from '@angular/core';
import { Room } from 'projects/models/src/lib/dashboard-api/room';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Observable } from 'rxjs';
import { MakerApiService } from '../../services/maker-api.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms$: Observable<Room[]>;
  devices$: Observable<HubitatDevice[]>;
  
  constructor(private roomService: RoomService, private makerApiSvc: MakerApiService) { 
    this.rooms$ = this.roomService.rooms$;
    this.roomService.load();
    this.makerApiSvc.loadDevices();
  }

  ngOnInit(): void {
    this.devices$ = this.makerApiSvc.devices$;
  }



}
