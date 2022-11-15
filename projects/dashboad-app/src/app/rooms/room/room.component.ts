import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RGB } from 'apis/core/color/rgb';
import { Device } from 'apis/models/device';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { RoomService } from 'projects/dashboad-app/src/services/room.service';
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
  devices$: Observable<Device[]>;
  selectedDevices: Device[];
  id: string;
  mode: string;
  someOn$: Observable<boolean>;

  constructor(private makerService: MakerApiService, private roomService: RoomService, private route: ActivatedRoute, private anyOnPipe: AnyOnPipe, private commandService: DeviceCommandService) {
    this.devices$ = makerService.devices$;
    this.makerService.loadDevices();
    this.roomService.load();

    combineLatest([route.params.pipe(map(x => x['id'])), this.roomService.rooms$, this.devices$]).subscribe(([id, rooms, devices]) => {
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

  identifier(index: number, item: Device){
    return item.id;
  }

  selectedUpdated(selected: Device[]) {
    this.selectedDevices = selected;
  }

  setColor(rgb: RGB){

  }

  toggleAll(){
    const someOn = this.anyOnPipe.transform(this.selectedDevices);
    this.selectedDevices.filter(x=>x.attributes.power).forEach(x=>{
      x.attributes.power = !someOn;
      this.commandService.state(x);
    });
  }

}
