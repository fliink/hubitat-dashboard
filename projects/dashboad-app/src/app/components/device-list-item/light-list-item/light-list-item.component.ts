import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';
import { DeviceCommandService } from '../../../services/device-command.service';

@Component({
  selector: 'app-light-list-item',
  templateUrl: './light-list-item.component.html',
  styleUrls: ['../device-list-item.component.scss', './light-list-item.component.scss']
})
export class LightListItemComponent implements OnInit {

  @Input() device: Device;
  constructor(private commandService: DeviceCommandService) { }

  ngOnInit(): void {
    
  }

  toggleLight(device: Device){
    const power = !device.attributes.power;
    this.commandService.state({ id: device.id, attributes: { power } });
  }

}
