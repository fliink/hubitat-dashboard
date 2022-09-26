import { Component, Input, OnInit } from '@angular/core';
import { Device } from 'apis/models/device';

@Component({
  selector: 'app-sensor-tile',
  templateUrl: './sensor-tile.component.html',
  styleUrls: ['./sensor-tile.component.scss']
})
export class SensorTileComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit(): void {
  }

}
