import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { RoomService } from 'projects/dashboad-app/src/services/room.service';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AnyOnPipe } from '../../pipes/any-on.pipe';
import { DeviceCommandService } from '../../services/device-command.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {


  name: string = 'New Room';
  devices$: Observable<HubitatDevice[]>;
  selectedDevices: HubitatDevice[];
  id: string;
  mode: string;
  someOn$: Observable<boolean>;

  constructor(private makerService: MakerApiService, private roomService: RoomService, private route: ActivatedRoute, private anyOnPipe: AnyOnPipe, private commandService: DeviceCommandService) {
    this.devices$ = makerService.devices$;
    this.makerService.loadDevices();
    this.roomService.load();

    combineLatest([route.params.pipe(map(x => x['id'])), this.roomService.rooms$, this.devices$]).pipe(take(1)).subscribe(([id, rooms, devices]) => {
      if (id == 'new') {
        this.mode = 'Edit';
        return;
      }
      this.mode = 'Display';
      this.id = id;
      var room = rooms.find(x => x.id === id);
      this.name = room.name
      this.selectedDevices = room.devices?.map(t => devices.find(d => d.id === t));
    });
  }

  ngOnInit(): void {
    this.someOn$ = this.makerService.devices$.pipe(map(x=>this.anyOnPipe.transform(this.selectedDevices)));
  }

  save() {
    this.roomService.save({
      name: this.name,
      devices: this.selectedDevices.map(x => x.id),
      id: this.id
    });
  }

  selectedUpdated(selected: HubitatDevice[]) {
    this.selectedDevices = selected;
  }

  toggleAll(){
    const someOn = this.anyOnPipe.transform(this.selectedDevices);
    const filterValue = someOn ? 'on' : 'off';
    const value = someOn ? 'off' : 'on';
    this.selectedDevices.filter(x=>x.attributes.switch == filterValue).forEach(x=>{
      this.commandService.emit(x, value, {
        attribute: 'switch', value
      });
    });
  }

}