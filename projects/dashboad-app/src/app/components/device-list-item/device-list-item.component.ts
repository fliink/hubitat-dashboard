import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { DeviceCommandService } from '../../services/device-command.service';

@Component({
  selector: 'app-device-list-item',
  templateUrl: './device-list-item.component.html',
  styleUrls: ['./device-list-item.component.scss']
})
export class DeviceListItemComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit(): void {
  }

}
