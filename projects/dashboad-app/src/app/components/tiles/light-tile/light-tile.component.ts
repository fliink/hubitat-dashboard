import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RGB } from 'apis/core/color/rgb';
import { Device } from 'apis/models/device';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-light-tile',
  templateUrl: './light-tile.component.html',
  styleUrls: ['./light-tile.component.scss']
})
export class LightTileComponent implements OnInit, OnChanges {

  @Input() device!: Device;
  rgb: any;
  selectedEffect: { key: number, value: string };

  constructor(private hubitatService: MakerApiService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.device?.currentValue) {
      //  TODO
      // if (this.device.capabilityLookup.LightEffects) {
      //   const selectedEffect = Object.entries(this.device.attributes.lightEffects).find(x => {
      //     return x[1] === this.device.attributes.effectName;
      //   });
      //   this.selectedEffect = { key: Number(selectedEffect[1]), value: <string>selectedEffect[1] };
      // }
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
    this.hubitatService.sendCommand(this.device.id, $event ? 'off' : 'on').pipe(take(1)).subscribe();
  }

  setHsl(value: RGB){
    // this.device.attributes.hue = value.hue;
    // this.device.attributes.saturation = 100 - Math.round(value.saturation);
    // this.hubitatService.sendCommand(this.device.id, { setSaturation: 100 - Math.round(value.saturation), setHue: Math.round(value.hue) }).pipe(take(1)).subscribe();
  }

}
