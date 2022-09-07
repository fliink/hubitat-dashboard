import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-thermostat-list-item',
  templateUrl: './thermostat-list-item.component.html',
  styleUrls: ['./device-list-item.component.scss', './thermostat-list-item.component.scss']
})
export class ThermostatListItemComponent implements OnInit {

  @Input() device: HubitatDevice;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
  }

}
