import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-light-list-item',
  templateUrl: './light-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './light-list-item.component.scss']
})
export class LightListItemComponent implements OnInit {

  @Input() device: HubitatDevice;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
    
  }

  toggleLight(device: HubitatDevice){
    var newValue = device.attributes.switch == 'on' ? 'off': 'on';
    this.commandService.emit(device, newValue, { attribute: 'switch', value: newValue });
  }

}
