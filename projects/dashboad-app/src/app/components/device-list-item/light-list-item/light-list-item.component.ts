import { Component, Input, OnInit } from '@angular/core';
import { RGB } from 'apis/core/color/rgb';
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

  toggleLight(power: boolean){
    this.commandService.state({ id: this.device.id, attributes: { power } });
  }

  setColor(rgb: RGB){
    this.commandService.state({ id: this.device.id, attributes: { rgb } });
  }

  setLevel(level: number){
    this.commandService.state({ id: this.device.id, attributes: { level } });
  }

}
