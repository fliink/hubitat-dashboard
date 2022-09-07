import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-switch-list-item',
  templateUrl: './switch-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './switch-list-item.component.scss']
})
export class SwitchListItemComponent implements OnInit {

  @Input() device: HubitatDevice;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
  }

  toggleSwitch(device: HubitatDevice){
    var newValue = device.attributes.switch == 'on' ? 'off': 'on';
    this.commandService.emit(device, newValue, { attribute: 'switch', value: newValue });
  }
}
