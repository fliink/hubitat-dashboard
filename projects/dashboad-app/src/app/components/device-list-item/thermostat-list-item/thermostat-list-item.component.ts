import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-thermostat-list-item',
  templateUrl: './thermostat-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './thermostat-list-item.component.scss']
})
export class ThermostatListItemComponent implements OnInit {

  @Input() device: Device;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
  }

}
