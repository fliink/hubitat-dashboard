import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { take } from 'rxjs/operators';
import { Hsl } from '../../color-slider/color-slider.component';

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
    this.hubitatService.sendCommand(this.device.id, { on: '', setEffect: id }).pipe(take(1)).subscribe();
  }

  setLevel(value: number): void {
    this.hubitatService.sendCommand(this.device.id, { setLevel: Math.round(value) }).pipe(take(1)).subscribe();
  }

  toggleSwitch($event: boolean){
    this.hubitatService.sendCommand(this.device.id, $event ? 'on' : 'off').pipe(take(1)).subscribe();
  }

  setHsl(value: Hsl){
    this.device.attributes.hue = value.hue;
    this.device.attributes.saturation = 100 - Math.round(value.saturation);
    this.hubitatService.sendCommand(this.device.id, { setSaturation: 100 - Math.round(value.saturation), setHue: Math.round(value.hue) }).pipe(take(1)).subscribe();
  }

}
