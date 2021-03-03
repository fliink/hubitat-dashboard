import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Component({
  selector: 'app-light-tile',
  templateUrl: './light-tile.component.html',
  styleUrls: ['./light-tile.component.scss']
})
export class LightTileComponent implements OnInit, OnChanges {

  @Input() device!: HubitatDevice;
  rgb: any;
  selectedEffect: { key: number, value: string };

  constructor(private hubitatService: MakerApiService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.device?.currentValue) {
      if (this.device.capabilityLookup.LightEffects) {
        const selectedEffect = Object.entries(this.device.attributes.lightEffects).find(x => {
          return x[1] === this.device.attributes.effectName;
        });
        this.selectedEffect = { key: Number(selectedEffect[1]), value: <string>selectedEffect[1] };
      }
    }
  }

  ngOnInit(): void {
  }

  setEffect(id: number): void {
    this.hubitatService.sendCommand(this.device.id, { on: '', setEffect: id }).subscribe();
  }

  setLevel(value: number): void {
    console.log('setValue', value);
    this.hubitatService.sendCommand(this.device.id, { setLevel: Math.round(value) }).subscribe();
  }

}
