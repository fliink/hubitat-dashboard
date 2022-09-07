import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { DeviceCommandService } from '../../services/device-command.service';

@Component({
  selector: 'app-device-list-item',
  templateUrl: './device-list-item.component.html',
  styleUrls: ['./device-list-item.component.scss']
})
export class DeviceListItemComponent implements OnInit {

  @Input() device: HubitatDevice;

  constructor() { }

  ngOnInit(): void {
  }

}
