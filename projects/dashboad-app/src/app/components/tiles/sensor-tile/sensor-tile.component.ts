import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Component({
  selector: 'app-sensor-tile',
  templateUrl: './sensor-tile.component.html',
  styleUrls: ['./sensor-tile.component.scss']
})
export class SensorTileComponent implements OnInit {

  @Input() device: HubitatDevice;

  constructor() { }

  ngOnInit(): void {
  }

}
