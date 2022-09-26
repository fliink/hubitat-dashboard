import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-switch-list-item',
  templateUrl: './switch-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './switch-list-item.component.scss']
})
export class SwitchListItemComponent implements OnInit {

  @Input() device: Device;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
  }

  toggleSwitch(device: Device){
    var newValue = device.attributes.power ? 'off': 'on';
    this.commandService.emit(device, newValue, { attribute: 'switch', value: newValue });
  }
}
