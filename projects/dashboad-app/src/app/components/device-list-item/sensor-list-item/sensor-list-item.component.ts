import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-sensor-list-item',
  templateUrl: './sensor-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './sensor-list-item.component.scss']
})
export class SensorListItemComponent implements OnInit {

  @Input() device: Device;
  constructor(private commandService: DeviceCommandService) { }
  ngOnInit(): void {
  }

}
