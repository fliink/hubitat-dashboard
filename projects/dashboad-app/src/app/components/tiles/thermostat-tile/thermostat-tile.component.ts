import { Component, Input, OnInit } from '@angular/core';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Component({
  selector: 'app-thermostat-tile',
  templateUrl: './thermostat-tile.component.html',
  styleUrls: ['./thermostat-tile.component.scss']
})
export class ThermostatTileComponent implements OnInit {

  @Input() device: HubitatDevice;

  constructor() { }

  ngOnInit(): void {
  }

}
